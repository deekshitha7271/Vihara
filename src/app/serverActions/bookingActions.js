'use server';

import DBConnection from "@/app/utils/config/db";
import BookingModel from "@/app/utils/models/Booking";
import HotelModel from "@/app/utils/models/hotel";
import { auth } from "@/app/auth";
import { revalidatePath } from "next/cache";

export async function updateBookingStatusAction(bookingId, status) {
    await DBConnection();
    const session = await auth();

    if (!session || session.user.role !== 'host') {
        return { success: false, message: "Unauthorized" };
    }

    try {
        const booking = await BookingModel.findById(bookingId).populate('hotel');
        if (!booking) {
            return { success: false, message: "Booking not found" };
        }

        // Verify ownership indirectly via Hotel
        // We already populated hotel, so we can check ownerId
        // But we need to ensure the logged-in user owns the hotel of this booking

        // Safety check: if hotel population failed or structure is different
        const hotel = await HotelModel.findById(booking.hotel._id || booking.hotel);

        if (!hotel || hotel.ownerId.toString() !== session.user.id) {
            return { success: false, message: "Unauthorized access to this booking" };
        }

        if (!['CONFIRMED', 'CANCELLED'].includes(status)) {
            return { success: false, message: "Invalid status" };
        }

        booking.status = status;
        await booking.save();

        revalidatePath('/host/bookings');
        return { success: true, message: `Booking ${status.toLowerCase()} successfully` };

    } catch (error) {
        console.error("Booking update error:", error);
        return { success: false, message: "Action failed: " + error.message };
    }
}
