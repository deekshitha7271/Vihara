
import DBConnection from "@/app/utils/config/db";
import HotelModel from "@/app/utils/models/hotel";
import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { writeFile, unlink } from "fs/promises";
import path from "path";

// GET: Fetch hotel details for editing
export async function GET(request, { params }) {
    await DBConnection();
    const session = await auth();
    const { id } = await params;

    if (!session || session.user.role !== 'host') {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const hotel = await HotelModel.findById(id);
        if (!hotel) {
            return NextResponse.json({ success: false, message: "Hotel not found" }, { status: 404 });
        }

        // Verify ownership
        if (hotel.ownerId.toString() !== session.user.id) {
            return NextResponse.json({ success: false, message: "Unauthorized access to this property" }, { status: 403 });
        }

        return NextResponse.json({ success: true, hotel }, { status: 200 });

    } catch (error) {
        console.error("Fetch hotel error:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

// PUT: Update hotel details
export async function PUT(request, { params }) {
    await DBConnection();
    const session = await auth();
    const { id } = await params;

    if (!session || session.user.role !== 'host') {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const hotel = await HotelModel.findById(id);
        if (!hotel) {
            return NextResponse.json({ success: false, message: "Hotel not found" }, { status: 404 });
        }

        if (hotel.ownerId.toString() !== session.user.id) {
            return NextResponse.json({ success: false, message: "You can only edit your own hotels" }, { status: 403 });
        }

        const data = await request.formData();

        // Extract fields
        const name = data.get("name");
        const location = data.get("location");
        const description = data.get("description");
        const shortDescription = data.get("shortDescription");
        const category = data.get("category");
        const price = data.get("price");
        const lat = data.get("lat");
        const lng = data.get("lng");
        const amenities = JSON.parse(data.get("amenities") || "[]");
        const facilities = JSON.parse(data.get("facilities") || "{}");
        const checkInTime = data.get("checkInTime");
        const checkOutTime = data.get("checkOutTime");
        const houseRules = JSON.parse(data.get("houseRules") || "[]");

        // Handle Image Update (Main Image)
        const imageFile = data.get("image");
        let imagePath = hotel.image;

        if (imageFile && typeof imageFile === 'object') {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const fileName = `updated_${Date.now()}_${imageFile.name}`;
            const filePath = path.join(process.cwd(), "public", "uploads", fileName);
            await writeFile(filePath, buffer);
            imagePath = `/uploads/${fileName}`;
        }

        // Handle Gallery Updates
        // Currently, we just APPEND new images. To delete, we'd need a separate logic or specific instructions.
        // Let's allow adding more images for now.
        const galleryFiles = data.getAll("gallery");
        let galleryPaths = [...(hotel.images || [])];

        // If user sent a special flag or list of "kept" images, we could filter `galleryPaths`.
        // For simplicity: We will assume the frontend sends the list of *existing* images to keep?
        // Actually, FormData usually only sends *new* files.
        // Let's rely on a separat 'existingImages' field if we want to handle deletions.
        const existingImages = JSON.parse(data.get("existingImages") || "null");
        if (existingImages) {
            galleryPaths = existingImages;
        }

        for (const file of galleryFiles) {
            if (file && typeof file === 'object' && file.name) {
                const gBuffer = Buffer.from(await file.arrayBuffer());
                const gName = `gallery_${Date.now()}_${file.name}`;
                const gPath = path.join(process.cwd(), "public", "uploads", gName);
                await writeFile(gPath, gBuffer);
                galleryPaths.push(`/uploads/${gName}`);
            }
        }

        // Update fields
        hotel.name = name;
        hotel.location = location;
        hotel.description = description;
        hotel.shortDescription = shortDescription;
        hotel.category = category;
        hotel.price = price;
        hotel.lat = lat;
        hotel.lng = lng;
        hotel.amenities = amenities;
        hotel.facilities = facilities;
        hotel.checkInTime = checkInTime;
        hotel.checkOutTime = checkOutTime;
        hotel.houseRules = houseRules;
        hotel.image = imagePath;
        hotel.images = galleryPaths;

        // If status was REJECTED, maybe set back to PENDING? 
        // For now, let's keep status as is, or maybe reset to PENDING if critical info changed? 
        // Let's keep it simple: Admins might need to re-approve if it changes? 
        // User didn't ask for that complexity. Let's leave status alone.

        await hotel.save();

        return NextResponse.json({ success: true, message: "Hotel updated successfully" }, { status: 200 });

    } catch (error) {
        console.error("Update hotel error:", error);
        return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
    }
}
