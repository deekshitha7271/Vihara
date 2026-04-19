import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import Stripe from "stripe";
import HotelModel from "@/app/utils/models/hotel";
import { isHotelAvailable } from "@/app/utils/bookingUtils";
import DBConnection from "@/app/utils/config/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        await DBConnection();
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { hotelId, checkIn, checkOut, guests } = body;

        if (!hotelId || !checkIn || !checkOut || !guests) {
            return NextResponse.json({ message: "Missing required booking details" }, { status: 400 });
        }

        const hotel = await HotelModel.findById(hotelId);
        if (!hotel) {
            return NextResponse.json({ message: "Hotel not found" }, { status: 404 });
        }

        // Check availability
        const available = await isHotelAvailable(hotelId, checkIn, checkOut);
        if (!available) {
            return NextResponse.json({ message: "This property is already booked for the selected dates." }, { status: 400 });
        }

        // Calculate nights
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        if (nights <= 0) {
            return NextResponse.json({ message: "Invalid date range" }, { status: 400 });
        }

        // Costs (matching the logic in BookingSidebar)
        const nightsCost = hotel.price * nights;
        const cleaningFee = Math.round(nightsCost * 0.05);
        const serviceFee = Math.round(nightsCost * 0.10);
        const totalAmount = nightsCost + cleaningFee + serviceFee;

        // Create Stripe Checkout Session
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: hotel.name,
                            description: `${nights} nights stay at ${hotel.location}`,
                            ...(hotel.image ? { 
                                images: [(() => {
                                    const imgUrl = hotel.image.startsWith('http') ? hotel.image : `${process.env.NEXTAUTH_URL}${hotel.image.startsWith('/') ? '' : '/'}${hotel.image}`;
                                    const encodedUrl = encodeURI(imgUrl);
                                    // Stripe often rejects localhost URLs for images. Skip it if it's local.
                                    if (encodedUrl.includes('localhost') || encodedUrl.includes('127.0.0.1')) {
                                        console.log("Skipping localhost image for Stripe:", encodedUrl);
                                        return null;
                                    }
                                    return encodedUrl;
                                })()].filter(img => img !== null) 
                            } : {}),
                        },
                        unit_amount: totalAmount * 100, // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.NEXTAUTH_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXTAUTH_URL}/booking/cancel`,
            metadata: {
                hotelId,
                userId: session.user.id,
                checkIn,
                checkOut,
                guests: guests.toString(),
                totalAmount: totalAmount.toString(),
            },
            customer_email: session.user.email,
        });

        return NextResponse.json({ url: checkoutSession.url });

    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}
