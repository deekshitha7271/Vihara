import DBConnection from "@/app/utils/config/db";
import UserModel from "@/app/utils/models/User";
import LocationModel from "@/app/utils/models/location";
import { auth } from "@/app/auth";
import { NextResponse } from "next/server";

export async function GET() {
  await DBConnection();

  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const locations = await LocationModel.find({});

  return NextResponse.json({
    success: true,
    locations: locations
  });
}
