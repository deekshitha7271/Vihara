import { LocationModel } from "@/app/utils/models/location"; // Check export, might be default
import DBConnection from "@/app/utils/config/db";
import LocationManagerClient from "./LocationManagerClient";
import AdminNavbar from "@/app/components/adminNavbar";

export default async function ManageLocationsPage() {
    await DBConnection();
    // LocationModel is likely a default export based on previous usage
    const Location = (await import("@/app/utils/models/location")).default;

    const locations = await Location.find({}).lean();
    const serializedLocations = locations.map(loc => ({
        ...loc,
        _id: loc._id.toString()
    }));

    return (
        <div>
            <AdminNavbar />
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '20px', fontSize: '2rem', fontWeight: 'bold' }}>Manage Locations</h1>
                <LocationManagerClient initialLocations={serializedLocations} />
            </div>
        </div>
    );
}
