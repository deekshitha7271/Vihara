import DBConnection from "@/app/utils/config/db";
import { NextResponse } from "next/server";
import HotelModel from "@/app/utils/models/hotel";

export async function GET(){
    await DBConnection();

    const hotels = await HotelModel.find({
        isFeatured:true,
        status:"APPROVED"
    }).limit(6);

    return NextResponse.json({
        success:true,
        data:hotels
    });
}