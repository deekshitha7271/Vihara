import DBConnection from "@/app/utils/config/db";
import HotelModel from "@/app/utils/models/hotel";
import { NextResponse } from "next/server";

export async function POST(request){
    await DBConnection();

    const {hotelId, status} = await request.json();

    if(!["APPROVED","REJECTED"].includes(status)) {
        return NextResponse.json(
            {success:false, message:"Invalid status"},
            {status:400}
        );
    }

    await HotelModel.findByIdAndUpdate(hotelId, {status});

    return NextResponse.json({
        success:true,
        message:`Hotel ${status.toLowerCase()}`
    });
}