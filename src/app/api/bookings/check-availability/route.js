import { NextResponse } from "next/server";
import { isHotelAvailable } from "@/app/utils/bookingUtils";
import DBConnection from "@/app/utils/config/db";

export async function GET(req) {
    try {
        await DBConnection();
        const { searchParams } = new URL(req.url);
        const hotelId = searchParams.get("hotelId");
        const checkIn = searchParams.get("checkIn");
        const checkOut = searchParams.get("checkOut");

        if (!hotelId || !checkIn || !checkOut) {
            return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
        }

        const available = await isHotelAvailable(hotelId, checkIn, checkOut);
        
        return NextResponse.json({ available });
    } catch (error) {
        console.error("Availability check API error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
