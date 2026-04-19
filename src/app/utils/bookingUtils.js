import BookingModel from "./models/Booking";
import DBConnection from "./config/db";

/**
 * Checks if a hotel is available for the given date range.
 * @param {string} hotelId - The ID of the hotel to check.
 * @param {Date|string} checkIn - The requested check-in date.
 * @param {Date|string} checkOut - The requested check-out date.
 * @returns {Promise<boolean>} - True if available, false otherwise.
 */
export async function isHotelAvailable(hotelId, checkIn, checkOut) {
    await DBConnection();

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    // Overlap condition: (StartA < EndB) && (EndA > StartB)
    const overlappingBooking = await BookingModel.findOne({
        hotel: hotelId,
        status: 'CONFIRMED',
        $and: [
            { checkIn: { $lt: end } },
            { checkOut: { $gt: start } }
        ]
    });

    return !overlappingBooking;
}
