import { LocationModel } from "@/app/utils/models/location"; // Check export, might be default
import DBConnection from "@/app/utils/config/db";
import LocationManagerClient from "./LocationManagerClient";
import AdminNavbar from "@/app/components/adminNavbar";
import styles from "./LocationManager.module.css";

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
            <div className={styles.pageContainer}>
                <h1 className={styles.pageTitle}>Manage Locations</h1>
                <LocationManagerClient initialLocations={serializedLocations} />
            </div>
        </div>
    );
}
