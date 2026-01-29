import { NextResponse } from "next/server";
import DBConnection from "@/app/utils/config/db";
import HotelModel from "@/app/utils/models/hotel";

export async function POST(req) {
    try {
        await DBConnection();
        const { hotelId, lat, lng } = await req.json();

        if (!hotelId || !lat || !lng) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        const updatedHotel = await HotelModel.findByIdAndUpdate(
            hotelId,
            { lat, lng },
            { new: true }
        );

        if (!updatedHotel) {
            return NextResponse.json({ message: "Hotel not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Location updated successfully",
            data: updatedHotel
        }, { status: 200 });

    } catch (error) {
        console.error("Location update error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
