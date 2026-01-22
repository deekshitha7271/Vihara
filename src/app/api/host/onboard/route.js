import DBConnection from "@/app/utils/config/db";
import UserModel from "@/app/utils/models/User";
import { NextResponse } from "next/server";
import { auth } from "@/app/auth"; // v5 correct

export async function POST() {
  await DBConnection();

  // Get session (v5)
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = session.user.id; // correct place

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // USER → HOST
    user.role = "host";
    user.hostProfile.completed = true;
    user.hostProfile.joinedAt = new Date();

    await user.save();

    return NextResponse.json({
      success: true,
      message: "You are now a Host"
    });
  } catch (error) {
    console.error("Host onboarding error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to become host" },
      { status: 500 }
    );
  }
}
