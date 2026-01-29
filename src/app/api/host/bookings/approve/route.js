import { auth } from "@/app/auth";
import DBConnection from "@/app/utils/config/db";
import BookingModel from "@/app/utils/models/Booking";
import HotelModel from "@/app/utils/models/hotel";
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

        // Verify the booking belongs to a hotel owned by this host
        const booking = await BookingModel.findById(bookingId).populate('hotel');
        if (!booking) {
            return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
        }

        // Check ownership
        // booking.hotel is populated, so it is an object.
        // We need to check if booking.hotel.ownerId matches session.user.id
        // NOTE: ownerId might be ObjectId, session.user.id is string.
        if (booking.hotel.ownerId.toString() !== session.user.id) {
            return NextResponse.json({ success: false, message: "Unauthorized access to this booking" }, { status: 403 });
        }

        // Update status
        booking.status = 'CONFIRMED';
        await booking.save();

        // Redirect back to bookings page
        return redirect('/host/bookings');

    } catch (error) {
        console.error("Error approving booking:", error);
        return redirect('/host/bookings?error=server_error');
    }
}
