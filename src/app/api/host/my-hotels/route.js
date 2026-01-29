import { auth } from "@/app/auth";
import DBConnection from "@/app/utils/config/db";
import HotelModel from "@/app/utils/models/hotel";
import { NextResponse } from "next/server";

export async function GET(req) {
   try {
      const session = await auth();
      if (!session || session.user.role !== 'host') {
         return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
      }

      await DBConnection();

      // Find hotels owned by this host
      const hotels = await HotelModel.find({ ownerId: session.user.id }).sort({ createdAt: -1 });

      return NextResponse.json({
         success: true,
         hotels: hotels
      });

   } catch (error) {
      console.error("Error fetching host hotels:", error);
      return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
   }
}