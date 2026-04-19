import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import DBConnection from "@/app/utils/config/db";
import BookingModel from "@/app/utils/models/Booking";
import HotelModel from "@/app/utils/models/hotel";

export async function POST(req) {
    try {
        await DBConnection();
        const session = await auth();

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: "Unauthorized. Please log in." }, { status: 401 });
        }

        const body = await req.json();
        const { hotelId, checkIn, checkOut, guests, totalPrice } = body;

        if (!hotelId || !checkIn || !checkOut || !guests || !totalPrice) {
            return NextResponse.json({ message: "Missing required booking details." }, { status: 400 });
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (checkOutDate <= checkInDate) {
            return NextResponse.json({ message: "Checkout date must be after check-in date." }, { status: 400 });
        }

        const hotel = await HotelModel.findById(hotelId);
        if (!hotel) {
            return NextResponse.json({ message: "Hotel not found." }, { status: 404 });
        }

        // Generic booking creation (can be used for requests or manual entry)
        const newBooking = await BookingModel.create({
            user: session.user.id,
            hotel: hotelId,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests: Number(guests),
            totalPrice: Number(totalPrice),
            status: 'PENDING',
            paymentStatus: 'PENDING'
        });

        return NextResponse.json({ message: "Booking registered successfully!", booking: newBooking }, { status: 201 });

    } catch (error) {
        console.error("Booking creation error:", error);
        return NextResponse.json({ message: "Failed to create booking.", error: error.message }, { status: 500 });
    }
}
