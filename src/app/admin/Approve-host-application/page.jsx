import DBConnection from "@/app/utils/config/db";
import HostApplication from "@/app/utils/models/HostApplication";
import "@/app/utils/models/User";
import AdminHostClient from "./AdminHostClient";

export default async function AdminHostApps() {
  console.log("Admin Host Apps: Connecting to DB...");
  await DBConnection();

  const rawApplications = await HostApplication.find({
    status: 'PENDING'
  })
    .populate('userId', 'username email')
    .lean();

  console.log(`Admin Host Apps: Found ${rawApplications.length} pending apps`);
  if (rawApplications.length > 0) {
    console.log("First App User:", rawApplications[0].userId);
  }

  const applications = rawApplications
    // .filter(app => app.userId) // Do not filter out apps with missing users
    .map(app => ({
      ...app,
      _id: app._id.toString(),
      userId: app.userId ? {
        ...app.userId,
        _id: app.userId._id.toString()
      } : {
        _id: null,
        username: "Unknown User (Deleted)",
        email: "N/A"
      }
    }));


  return (
    <AdminHostClient applications={applications} />
  );
}   