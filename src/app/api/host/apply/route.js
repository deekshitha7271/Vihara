import DBConnection from "@/app/utils/config/db";
import HostApplication from "@/app/utils/models/HostApplication";
import User from "@/app/utils/models/User";
import { auth } from '@/app/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
    await DBConnection();
    const session = await auth();

    if (!session) {
        return NextResponse.json({ success: false }, { status: 401 });
    }

    // Verify user exists in DB (handle stale sessions)
    const user = await User.findById(session.user.id);
    if (!user) {
        return NextResponse.json({
            success: false,
            message: "User account not found. Please register again."
        }, { status: 401 });
    }

    const body = await request.json();

    const existingApp = await HostApplication.findOne({ userId: session.user.id });
    if (existingApp) {
        if (existingApp.status === 'PENDING') {
            return NextResponse.json({
                success: false,
                message: "You have already submitted an application. Please wait for approval."
            }, { status: 409 });
        } else if (existingApp.status === 'APPROVED') {
            return NextResponse.json({
                success: false,
                message: "You are already an approved host."
            }, { status: 409 });
        } else if (existingApp.status === 'REJECTED') {
            // If rejected, remove the old application so they can re-apply
            await HostApplication.findByIdAndDelete(existingApp._id);
        }
    }

    await HostApplication.create({
        userId: session.user.id,
        status: "PENDING",
        ...body
    });

    return NextResponse.json({
        success: true,
        message: "Application submitted successfully"
    })

}