'use server';

import DBConnection from "@/app/utils/config/db";
import HotelModel from "@/app/utils/models/hotel";
import LocationModel from "@/app/utils/models/location";
import { auth } from "@/app/auth";
import { revalidatePath } from "next/cache";
import { writeFile } from 'fs/promises';
import path from 'path';

export async function updateLocationAction(hotelId, lat, lng) {
    await DBConnection();

    // Optional: Add auth check if this is restricted to host/admin
    // const session = await auth();
    // if (!session) return { success: false, message: "Unauthorized" };

    if (!hotelId || !lat || !lng) {
        return { success: false, message: "Missing fields" };
    }

    try {
        const updatedHotel = await HotelModel.findByIdAndUpdate(
            hotelId,
            { lat, lng },
            { new: true }
        );

        if (!updatedHotel) {
            return { success: false, message: "Hotel not found" };
        }

        revalidatePath('/host/my-hotels'); // or wherever this is used
        return { success: true, message: "Location updated successfully" };

    } catch (error) {
        console.error("Location update error:", error);
        return { success: false, message: "Update failed: " + error.message };
    }
}

export async function createLocationAction(formData) {
    await DBConnection();

    // Optional: Add auth check
    // const session = await auth();
    // if (!session || session.user.role !== 'admin') return { success: false, message: "Unauthorized" };

    try {
        const locationName = formData.get('location');
        const description = formData.get('description');
        const category = formData.get('category');
        const imageFile = formData.get('image');

        if (!locationName || !imageFile) {
            return { success: false, message: "Location name and image are required" };
        }

        let imagePath = '';
        if (imageFile && imageFile.size > 0) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const fileName = `location_${Date.now()}_${imageFile.name.replace(/\s+/g, '_')}`;
            const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
            await writeFile(filePath, buffer);
            imagePath = `/uploads/${fileName}`;
        }

        const newLocation = await LocationModel.create({
            location: locationName,
            image: imagePath,
            description,
            category
        });

        revalidatePath('/admin');
        return { success: true, message: "Location added successfully" };

    } catch (error) {
        console.error("Create location error:", error);
        return { success: false, message: "Creation failed: " + error.message };
    }
}

export async function getLocationsAction() {
    await DBConnection();
    try {
        const locations = await LocationModel.find({}).lean();
        return {
            success: true,
            data: locations.map(loc => ({ ...loc, _id: loc._id.toString() }))
        };
    } catch (error) {
        console.error("Get locations error:", error);
        return { success: false, message: "Failed to fetch locations" };
    }
}

export async function updateLocationDetailsAction(formData) {
    await DBConnection();
    try {
        const id = formData.get('id');
        const locationName = formData.get('location');
        const description = formData.get('description');
        const category = formData.get('category');
        const imageFile = formData.get('image');

        const location = await LocationModel.findById(id);
        if (!location) return { success: false, message: "Location not found" };

        let imagePath = location.image;
        if (imageFile && imageFile.size > 0) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const fileName = `location_${Date.now()}_${imageFile.name.replace(/\s+/g, '_')}`;
            const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
            await writeFile(filePath, buffer);
            imagePath = `/uploads/${fileName}`;
        }

        location.location = locationName;
        location.description = description;
        location.category = category;
        location.image = imagePath;

        await location.save();
        revalidatePath('/admin');
        revalidatePath('/admin/manage-locations');
        return { success: true, message: "Location updated successfully" };
    } catch (error) {
        console.error("Update location error:", error);
        return { success: false, message: "Update failed: " + error.message };
    }
}

export async function deleteLocationAction(locationId) {
    await DBConnection();
    try {
        await LocationModel.findByIdAndDelete(locationId);
        revalidatePath('/admin');
        revalidatePath('/admin/manage-locations');
        return { success: true, message: "Location deleted successfully" };
    } catch (error) {
        console.error("Delete location error:", error);
        return { success: false, message: "Delete failed: " + error.message };
    }
}
