import DBConnection from "@/app/utils/config/db";
import { NextResponse } from "next/server";
import HotelModel from "@/app/utils/models/hotel";

export async function GET(){
    await DBConnection();
     const ownerId = req.nextUrl.searchParams.get("ownerId");

     const hotels = await HotelModel.find({ownerId});

     return NextResponse.json({
        success:true,
        data:hotels
     });

}