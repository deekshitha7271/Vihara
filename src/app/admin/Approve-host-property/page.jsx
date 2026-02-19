import DBConnection from "@/app/utils/config/db";
import HotelModel from "@/app/utils/models/hotel";
import PendingHotelsClient from "./PendingHotelsClient";

export default async function AdminPendingHotels() {
  await DBConnection();

  const rawHotels = await HotelModel.find({ status: "PENDING" }).sort({ createdAt: -1 }).lean();

  const hotels = rawHotels.map(hotel => ({
    ...hotel,
    _id: hotel._id.toString(),
    ownerId: hotel.ownerId.toString(),
    createdAt: hotel.createdAt?.toISOString(),
    updatedAt: hotel.updatedAt?.toISOString()
  }));

  return <PendingHotelsClient hotels={hotels} />;
}
