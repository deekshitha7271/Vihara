'use server';

import DBConnection from "@/app/utils/config/db";
import HostApplication from "@/app/utils/models/HostApplication";
import User from "@/app/utils/models/User";
import { auth } from "@/app/auth";
import { revalidatePath } from "next/cache";

export async function applyHostAction(formData) {
    await DBConnection();
    const session = await auth();

    if (!session) {
        return { success: false, message: "Unauthorized" };
    }

    // Verify user exists
    const user = await User.findById(session.user.id);
    if (!user) {
        return { success: false, message: "User account not found." };
    }

    const existingApp = await HostApplication.findOne({ userId: session.user.id });
    if (existingApp) {
        if (existingApp.status === 'PENDING') {
            return { success: false, message: "Application already pending." };
        } else if (existingApp.status === 'APPROVED') {
            return { success: false, message: "You are already a host." };
        } else if (existingApp.status === 'REJECTED') {
            await HostApplication.findByIdAndDelete(existingApp._id);
        }
    }

    try {
        const hostingReason = formData.get("hostingReason");
        const hostingExperience = formData.get("hostingExperience");
        const city = formData.get("city");

        // Check required fields
        if (!hostingReason || !hostingExperience || !city) {
            return { success: false, message: "All fields are required" };
        }

        await HostApplication.create({
            userId: session.user.id,
            email: session.user.email, // Ensure email is saved if schema requires it
            status: "PENDING",
            hostingReason,
            hostingExperience,
            city
        });

        revalidatePath('/host/onboarding'); // Revalidate local page if needed
        return { success: true, message: "Application submitted successfully" };

    } catch (error) {
        console.error("Host application error:", error);
        return { success: false, message: "Submission failed: " + error.message };
    }
}
