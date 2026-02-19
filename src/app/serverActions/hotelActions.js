'use server';

import DBConnection from "@/app/utils/config/db";
import HotelModel from "@/app/utils/models/hotel";
import UserModel from "@/app/utils/models/User";
import LocationModel from "@/app/utils/models/location";
import { writeFile } from "fs/promises";
import path from "path";
import { auth } from "@/app/auth";
import { revalidatePath } from "next/cache";

export async function createHotelAction(formData) {
  await DBConnection();

  // 1. Auth Check
  const session = await auth();
  if (!session) return { success: false, message: "Unauthorized" };
  if (session.user.role !== "host") return { success: false, message: "Only hosts can add hotels" };

  const ownerId = session.user.id;

  try {
    console.log("Starting createHotelAction");
    // 2. Read Basic Fields
    const image = formData.get("image");
    const name = formData.get("name");
    const location = formData.get("location");
    const description = formData.get("description");
    const category = formData.get("category");
    const price = formData.get("price");

    if (!image || !name || !location || !price) {
      return { success: false, message: "Missing required fields" };
    }

    // 3. Verify Host Profile
    const user = await UserModel.findById(ownerId);
    if (!user || !user.hostProfile?.completed) {
      return { success: false, message: "Host profile not approved" };
    }

    // 4. Verify Location
    const locationDoc = await LocationModel.findOne({ location });
    if (!locationDoc) {
      return { success: false, message: "Invalid location" };
    }

    // 5. Save Main Image
    console.log("Processing main image...");
    const buffer = Buffer.from(await image.arrayBuffer());
    console.log("Main image buffer created");
    const mainFilename = `${Date.now()}_main_${image.name.replace(/\s+/g, '_')}`;
    const imagePath = path.join(process.cwd(), "public", "uploads", mainFilename);
    await writeFile(imagePath, buffer);

    // 6. Process Gallery Images
    const galleryFiles = formData.getAll("gallery");
    const galleryPaths = [];

    for (const file of galleryFiles) {
      // Check if file is valid (size > 0)
      console.log("Processing gallery file:", file.name);
      if (file && file.size > 0 && file.name && file.name !== 'undefined') {
        try {
          const gBuffer = Buffer.from(await file.arrayBuffer());
          const gFilename = `${Date.now()}_gal_${file.name.replace(/\s+/g, '_')}`;
          const gPath = path.join(process.cwd(), "public", "uploads", gFilename);
          await writeFile(gPath, gBuffer);
          galleryPaths.push(`/uploads/${gFilename}`);
        } catch (fileErr) {
          console.error(`Failed to process gallery file ${file.name}:`, fileErr);
        }
      }
    }

    // 7. Parse Complex JSON fields (Amenities, Facilities, Rules)
    // 7. Parse Complex JSON fields (Amenities, Facilities, Rules)
    let amenities = [], facilities = {}, houseRules = [];
    try {
      amenities = JSON.parse(formData.get("amenities") || "[]");
      facilities = JSON.parse(formData.get("facilities") || "{}");
      houseRules = JSON.parse(formData.get("houseRules") || "[]");
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return { success: false, message: "Invalid data format for amenities/facilities" };
    }

    // Convert lat/lng safely
    const latVal = parseFloat(formData.get("lat"));
    const lngVal = parseFloat(formData.get("lng"));

    // 8. Create Hotel Document
    console.log("Creating Hotel Model...");
    const newHotel = new HotelModel({
      name,
      location: locationDoc.location,
      description,
      shortDescription: formData.get("shortDescription"),
      category,
      price,
      image: `/uploads/${mainFilename}`,
      images: galleryPaths,
      ownerId,
      status: "PENDING",
      isFeatured: false,
      lat: isNaN(latVal) ? 0 : latVal,
      lng: isNaN(lngVal) ? 0 : lngVal,
      amenities,
      facilities,
      checkInTime: formData.get("checkInTime"),
      checkOutTime: formData.get("checkOutTime"),
      houseRules
    });

    await newHotel.save();
    console.log("Hotel saved successfully");

    revalidatePath('/host/my-hotels');
    return { success: true, message: "Hotel submitted for approval" };

  } catch (error) {
    console.error("Hotel creation error:", error);
    return { success: false, message: "Hotel creation failed: " + error.message };
  }
}

export async function updateHotelAction(formData) {
  await DBConnection();

  const session = await auth();
  if (!session) return { success: false, message: "Unauthorized" };
  if (session.user.role !== "host") return { success: false, message: "Only hosts can modify hotels" };

  const hotelId = formData.get("hotelId");
  if (!hotelId) return { success: false, message: "Hotel ID is missing" };

  try {
    const hotel = await HotelModel.findById(hotelId);
    if (!hotel) return { success: false, message: "Hotel not found" };
    if (hotel.ownerId.toString() !== session.user.id) {
      return { success: false, message: "Unauthorized access to this property" };
    }

    // Basic Fields
    hotel.name = formData.get("name");
    hotel.location = formData.get("location");
    hotel.description = formData.get("description");
    hotel.shortDescription = formData.get("shortDescription");
    hotel.category = formData.get("category");
    hotel.price = formData.get("price");
    // Convert lat/lng safely
    const latVal = parseFloat(formData.get("lat"));
    const lngVal = parseFloat(formData.get("lng"));

    hotel.lat = isNaN(latVal) ? 0 : latVal;
    hotel.lng = isNaN(lngVal) ? 0 : lngVal;

    // Complex Fields
    try {
      hotel.amenities = JSON.parse(formData.get("amenities") || "[]");
      hotel.facilities = JSON.parse(formData.get("facilities") || "{}");
      hotel.houseRules = JSON.parse(formData.get("houseRules") || "[]");
    } catch (parseError) {
      console.error("Update JSON Parse Error:", parseError);
      return { success: false, message: "Invalid data format" };
    }

    // Main Image Update
    const imageFile = formData.get("image");
    if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
      try {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const fileName = `updated_${Date.now()}_${imageFile.name.replace(/\s+/g, '_')}`;
        const filePath = path.join(process.cwd(), "public", "uploads", fileName);
        await writeFile(filePath, buffer);
        hotel.image = `/uploads/${fileName}`;
      } catch (imgErr) {
        console.error("Update main image failed:", imgErr);
      }
    }

    // Gallery Updates
    const galleryFiles = formData.getAll("gallery");
    const existingImages = JSON.parse(formData.get("existingImages") || "[]");

    let galleryPaths = [...existingImages];

    for (const file of galleryFiles) {
      if (file && file.size > 0 && file.name && file.name !== 'undefined') {
        try {
          const gBuffer = Buffer.from(await file.arrayBuffer());
          const gName = `gallery_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
          const gPath = path.join(process.cwd(), "public", "uploads", gName);
          await writeFile(gPath, gBuffer);
          galleryPaths.push(`/uploads/${gName}`);
        } catch (galErr) {
          console.error("Update gallery image failed:", galErr);
        }
      }
    }
    hotel.images = galleryPaths;

    await hotel.save();
    revalidatePath('/host/my-hotels');
    return { success: true, message: "Hotel updated successfully" };

  } catch (error) {
    console.error("Update hotel error:", error);
    return { success: false, message: "Update failed: " + error.message };
  }
}
