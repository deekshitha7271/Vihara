import { NextResponse } from "next/server";
import Stripe from "stripe";
import DBConnection from "@/app/utils/config/db";
import BookingModel from "@/app/utils/models/Booking";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
    const sig = req.headers.get("stripe-signature");
    let event;

    try {
        const body = await req.text();
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return NextResponse.json({ message: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const metadata = session.metadata;

        try {
            await DBConnection();

            // Create the booking record
            await BookingModel.create({
                user: metadata.userId,
                hotel: metadata.hotelId,
                checkIn: new Date(metadata.checkIn),
                checkOut: new Date(metadata.checkOut),
                guests: parseInt(metadata.guests),
                totalPrice: parseFloat(metadata.totalAmount),
                status: "CONFIRMED",
                paymentStatus: "PAID",
            });

            console.log(`Booking created for session ${session.id}`);
        } catch (dbError) {
            console.error("Database error creating booking from webhook:", dbError);
            // We should ideally return a 500 here so Stripe retries, 
            // but we might want to log it carefully first.
            return NextResponse.json({ message: "Database error" }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}
