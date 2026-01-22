import DBConnection from "@/app/utils/config/db";
import HotelModel from "@/app/utils/models/hotel";
import { NextResponse } from "next/server";

export async function GET(){
    await DBConnection();

    try{
        const hotels = await HotelModel.find({status:"PENDING"});

        return NextResponse.json({
            success:true,
            data:hotels
        });
    }
    catch(e){
        return NextResponse.json(
            {success:false},
            {status:500}
        );

    }
}