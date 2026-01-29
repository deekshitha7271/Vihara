import { auth } from "@/app/auth";
import DBConnection from "@/app/utils/config/db";
import BookingModel from "@/app/utils/models/Booking";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function POST(req) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'host') {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const bookingId = searchParams.get('id');

        if (!bookingId) {
            return NextResponse.json({ success: false, message: "Booking ID required" }, { status: 400 });
        }

        await DBConnection();

        const booking = await BookingModel.findById(bookingId).populate('hotel');
        if (!booking) {
            return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
        }

        if (booking.hotel.ownerId.toString() !== session.user.id) {
            return NextResponse.json({ success: false, message: "Unauthorized access to this booking" }, { status: 403 });
        }

        booking.status = 'CANCELLED';
        await booking.save();

        return redirect('/host/bookings');

    } catch (error) {
        console.error("Error rejecting booking:", error);
        return redirect('/host/bookings?error=server_error');
    }
}
