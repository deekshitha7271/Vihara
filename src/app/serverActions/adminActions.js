'use server';

import DBConnection from "@/app/utils/config/db";
import HostApplication from "@/app/utils/models/HostApplication";
import User from "@/app/utils/models/User";
import HotelModel from "@/app/utils/models/hotel";
import { auth } from "@/app/auth";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
    }
    return session;
}

export async function approveHostAction(applicationId) {
    await DBConnection();
    try {
        await checkAdmin();

        const application = await HostApplication.findById(applicationId);
        if (!application) return { success: false, message: "Application not found" };

        application.status = "APPROVED";
        await application.save();

        const user = await User.findById(application.userId);
        if (user) {
            user.role = "host";
            user.hostProfile = {
                status: "APPROVED",
                completed: true,
                details: applicationId
            };
            await user.save();
        }

        revalidatePath("/admin/Approve-host-application");
        return { success: true, message: "Host approved successfully" };
    } catch (error) {
        console.error("Approve host error:", error);
        return { success: false, message: error.message };
    }
}

export async function rejectHostAction(applicationId) {
    await DBConnection();
    try {
        await checkAdmin();

        const application = await HostApplication.findById(applicationId);
        if (!application) return { success: false, message: "Application not found" };

        application.status = "REJECTED";
        await application.save();

        revalidatePath("/admin/Approve-host-application");
        return { success: true, message: "Host rejected successfully" };
    } catch (error) {
        console.error("Reject host error:", error);
        return { success: false, message: error.message };
    }
}

export async function updateHotelStatusAction(hotelId, status) {
    await DBConnection();
    try {
        await checkAdmin();

        if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
            return { success: false, message: "Invalid status" };
        }

        const hotel = await HotelModel.findById(hotelId);
        if (!hotel) return { success: false, message: "Hotel not found" };

        hotel.status = status;
        await hotel.save();

        revalidatePath("/admin/pending-hotels"); // Assuming this is where approvals happen
        revalidatePath("/admin/all-hotels"); // If there is such a page

        return { success: true, message: `Hotel ${status.toLowerCase()} successfully` };
    } catch (error) {
        console.error("Update hotel status error:", error);
        return { success: false, message: error.message };
    }
}
