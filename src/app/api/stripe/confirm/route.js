import { NextResponse } from "next/server";
import Stripe from "stripe";
import DBConnection from "@/app/utils/config/db";
import BookingModel from "@/app/utils/models/Booking";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        await DBConnection();
        const { session_id } = await req.json();

        if (!session_id) {
            return NextResponse.json({ message: "Session ID is required" }, { status: 400 });
        }

        // 1. Check if booking already exists for this session to prevent duplicates
        const existingBooking = await BookingModel.findOne({ stripeSessionId: session_id });
        if (existingBooking) {
            return NextResponse.json({ success: true, booking: existingBooking });
        }

        // 2. Retrieve the session from Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status !== 'paid') {
            return NextResponse.json({ message: "Payment not completed" }, { status: 400 });
        }

        const { hotelId, userId, checkIn, checkOut, guests, totalAmount } = session.metadata;

        // 3. Create the booking
        const newBooking = await BookingModel.create({
            user: userId,
            hotel: hotelId,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            guests: parseInt(guests),
            totalPrice: parseFloat(totalAmount),
            status: "CONFIRMED",
            paymentStatus: "PAID",
            stripeSessionId: session_id // We need to add this field to the model
        });

        return NextResponse.json({ success: true, booking: newBooking });

    } catch (error) {
        console.error("Stripe Confirmation Error:", error);
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}
