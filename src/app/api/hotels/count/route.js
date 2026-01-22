import DBConnection from "@/app/utils/config/db";
import { NextResponse } from "next/server";
import HotelModel from "@/app/utils/models/hotel";

export async function GET(){
    await DBConnection();

    const count = await HotelModel.countDocuments({
        status: "APPROVED"
    });

    return NextResponse.json({
        success:true,
        count
    });
}
