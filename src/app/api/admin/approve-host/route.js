import DBConnection from "@/app/utils/config/db";
import HostApplication from "@/app/utils/models/HostApplication";
import UserModel from "@/app/utils/models/User";
import LocationModel from "@/app/utils/models/location";
import { auth } from "@/app/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  await DBConnection();

  // 1️⃣ AUTH CHECK
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 403 }
    );
  }

  // 2️⃣ INPUT VALIDATION
  const { applicationId } = await request.json();
  if (!applicationId) {
    return NextResponse.json(
      { success: false, message: "Application ID missing" },
      { status: 400 }
    );
  }

  // 3️⃣ FETCH APPLICATION
  const application = await HostApplication.findById(applicationId);
  if (!application) {
    return NextResponse.json(
      { success: false, message: "Application not found" },
      { status: 404 }
    );
  }

  // 4️⃣ FETCH USER
  const user = await UserModel.findById(application.userId);
  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  // 5️⃣ ASSIGN HOST ROLE
  user.role = "host";
  user.hostProfile.completed = true;
  user.hostProfile.joinedAt = new Date();

  // 6️⃣ ASSIGN ALLOWED LOCATIONS (ALL LOCATIONS)
  const locations = await LocationModel.find({}, "_id");
  user.hostProfile.allowedLocations = locations.map(loc => loc._id);

  await user.save();

  // 7️⃣ UPDATE APPLICATION STATUS
  application.status = "APPROVED";
  await application.save();

  // 8️⃣ RESPONSE
  return NextResponse.json({
    success: true,
    message: "Host application approved successfully"
  });
}
