import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import styles from "./myHotels.module.css";
import HostSidebar from "@/app/components/HostSidebar";
import HotelImage from "./HotelImage";
import { Plus, MapPin } from "lucide-react";

async function getHotels() {
    // We need to use absolute URL or call DB directly in server component
    // Since we are in a server component, let's call logic directly if possible, or use absolute API url.
    // For simplicity/reliability in server component, calling DB directly is often better if we don't want to handle cookie passing manually to fetch.
    // However, since we defined an API route, let's use it client side or just replicate logic?
    // Let's use the DB logic directly here for Server Side Rendering efficiency.

    // BUT, we can't import DBConnection/Models in client components.
    // This is a Server Component, so we can.

    // Actually, let's fetch from the API to keep separation if 'fetch' automatically handles cookies in newer next.js... 
    // Wait, fetch in SC to localhost requires full URL.
    // Let's just import the model logic to be safe and fast.

    const { default: DBConnection } = await import("@/app/utils/config/db");
    const { default: HotelModel } = await import("@/app/utils/models/hotel");
    const { auth: getSession } = await import("@/app/auth");

    const session = await getSession();
    if (!session) return [];

    await DBConnection();
    const hotels = await HotelModel.find({ ownerId: session.user.id }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(hotels)); // Serialize for passing to component
}

export default async function MyHotels() {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    if (session.user.role !== 'host') {
        redirect('/host/dashboard');
    }

    const hotels = await getHotels();

    return (
        <div className={styles.container}>
            <HostSidebar username={session.user.username} />

            <div className={styles.main}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <h1>My Properties</h1>
                        <p className={styles.subtitle}>Manage your listed hotels and stays.</p>
                    </div>
                    <a href="/host/add-hotel" className={styles.addBtn}>
                        <Plus size={20} /> Add New Hotel
                    </a>
                </div>

                {hotels.length === 0 ? (
                    <div className={styles.emptyState}>
                        <h2>No properties listed yet</h2>
                        <p>Get started by adding your first hotel!</p>
                        <br />
                        <a href="/host/add-hotel" style={{ color: 'rgb(72, 206, 184)', fontWeight: 600 }}>List a property now</a>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {hotels.map(hotel => (
                            <div key={hotel._id} className={styles.card}>
                                <div className={styles.imageContainer}>
                                    {/* Using standard img for now to avoid next/image domain config issues with user uploads */}
                                    <HotelImage
                                        src={hotel.image}
                                        alt={hotel.name}
                                        className={styles.hotelImage}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                        padding: '4px 12px',
                                        borderRadius: '12px',
                                        background: 'rgba(0,0,0,0.6)',
                                        color: 'white',
                                        fontSize: '0.8rem',
                                        fontWeight: 600
                                    }}>
                                        {hotel.category}
                                    </div>
                                </div>
                                <div className={styles.content}>
                                    <h3 className={styles.hotelName}>{hotel.name}</h3>
                                    <div className={styles.location}>
                                        <MapPin size={16} /> {hotel.location}
                                    </div>
                                    <div className={styles.footer}>
                                        <span className={styles.price}>₹{hotel.price}<span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#666' }}>/night</span></span>
                                        <span className={`${styles.status} ${styles[hotel.status.toLowerCase()]}`}>
                                            {hotel.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
