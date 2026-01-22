import DBConnection from "@/app/utils/config/db";
import HotelModel from "@/app/utils/models/hotel";
import UserModel from "@/app/utils/models/User";
import LocationModel from "@/app/utils/models/location";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { auth } from "@/app/auth";

export async function POST(request) {
  await DBConnection();

  // 1️⃣ Get session
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  if (session.user.role !== "host") {
    return NextResponse.json(
      { success: false, message: "Only hosts can add hotels" },
      { status: 403 }
    );
  }

  const ownerId = session.user.id;

  // 2️⃣ Read form data
  const data = await request.formData();

  const image = data.get("image");
  const name = data.get("name");
  const location = data.get("location"); // location name (string)
  const description = data.get("description");
  const category = data.get("category");
  const price = data.get("price");

  if (!image || !name || !location || !price) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  // 3️⃣ Get logged-in host
  const user = await UserModel.findById(ownerId);

  if (!user || !user.hostProfile?.completed) {
    return NextResponse.json(
      { success: false, message: "Host profile not approved" },
      { status: 403 }
    );
  }

  // 4️⃣ Find location document
  const locationDoc = await LocationModel.findOne({ location });

  if (!locationDoc) {
    return NextResponse.json(
      { success: false, message: "Invalid location" },
      { status: 400 }
    );
  }

  // 5️⃣ CHECK IF HOST IS ALLOWED FOR THIS LOCATION
  const allowedLocationIds = user.hostProfile.allowedLocations
    .map(id => id.toString());

  if (!allowedLocationIds.includes(locationDoc._id.toString())) {
    return NextResponse.json(
      {
        success: false,
        message: "You are not allowed to add hotels in this location"
      },
      { status: 403 }
    );
  }

  // 6️⃣ Save image
  const buffer = Buffer.from(await image.arrayBuffer());
  const imagePath = path.join(
    process.cwd(),
    "public",
    "uploads",
    image.name
  );

  try {
    await writeFile(imagePath, buffer);

    // 7️⃣ Create hotel
    const newHotel = new HotelModel({
      name,
      location: locationDoc.location, // keep clean
      description,
      category,
      price,
      image: `/uploads/${image.name}`,
      ownerId,
      status: "PENDING",
      isFeatured: false
    });

    await newHotel.save();

    return NextResponse.json(
      { success: true, message: "Hotel submitted for approval" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Hotel creation error:", error);
    return NextResponse.json(
      { success: false, message: "Hotel creation failed" },
      { status: 500 }
    );
  }
}
