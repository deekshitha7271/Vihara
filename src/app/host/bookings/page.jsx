import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import styles from "./bookings.module.css";
import HostSidebar from "@/app/components/HostSidebar";
import { CalendarX, Check, X } from "lucide-react";

async function getBookings() {
    const { default: DBConnection } = await import("@/app/utils/config/db");
    const { default: BookingModel } = await import("@/app/utils/models/Booking");
    const { default: HotelModel } = await import("@/app/utils/models/hotel");
    const { default: UserModel } = await import("@/app/utils/models/User"); // Ensure User model is loaded for population
    const { auth: getSession } = await import("@/app/auth");

    const session = await getSession();
    if (!session) return [];

    await DBConnection();

    // 1. Find all hotels owned by host
    const hotels = await HotelModel.find({ ownerId: session.user.id });
    const hotelIds = hotels.map(h => h._id);

    // 2. Find bookings for these hotels
    // Need to populate user (guest) and hotel details
    const bookings = await BookingModel.find({ hotel: { $in: hotelIds } })
        .populate('user', 'username email')
        .populate('hotel', 'name')
        .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(bookings));
}

export default async function Bookings() {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    if (session.user.role !== 'host') {
        redirect('/host/dashboard');
    }

    const bookings = await getBookings();

    return (
        <div className={styles.container}>
            <HostSidebar username={session.user.username} />

            <div className={styles.main}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Reservations</h1>
                    <p className={styles.subtitle}>Manage incoming bookings and check-ins.</p>
                </div>

                {bookings.length === 0 ? (
                    <div className={styles.emptyState}>
                        <CalendarX size={64} className={styles.emptyIcon} />
                        <h2>No bookings yet</h2>
                        <p>When guests book your properties, they will appear here.</p>
                    </div>
                ) : (
                    <div>
                        {bookings.map(booking => (
                            <div key={booking._id} className={styles.bookingCard}>
                                <div className={styles.bookingInfo}>
                                    {/* Guest Info */}
                                    <div className={styles.guestInfo}>
                                        <div className={styles.guestAvatar}>
                                            {booking.user?.username?.[0]?.toUpperCase() || 'G'}
                                        </div>
                                        <div className={styles.guestDetails}>
                                            <h3>{booking.user?.username || 'Unknown Guest'}</h3>
                                            <p>{booking.user?.email}</p>
                                        </div>
                                    </div>

                                    {/* Hotel */}
                                    <div className={styles.stayDetails}>
                                        <h4>Property</h4>
                                        <p>{booking.hotel?.name}</p>
                                    </div>

                                    {/* Dates */}
                                    <div className={styles.stayDetails}>
                                        <h4>Dates</h4>
                                        <p>{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</p>
                                    </div>

                                    {/* Price & Status */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>${booking.totalPrice}</span>
                                        <span className={`${styles.status} ${styles[booking.status.toLowerCase()]}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions - Only for Pending */}
                                {booking.status === 'PENDING' && (
                                    <div className={styles.actions}>
                                        {/* TODO: Add Server Actions for Accept/Reject. 
                                            For now, just UI placeholders or we can implement form actions.
                                        */}
                                        <form action={`/api/host/bookings/approve?id=${booking._id}`} method="POST">
                                            <button className={`${styles.btn} ${styles.acceptBtn}`} title="Accept Booking">
                                                <Check size={20} />
                                            </button>
                                        </form>

                                        <form action={`/api/host/bookings/reject?id=${booking._id}`} method="POST">
                                            <button className={`${styles.btn} ${styles.rejectBtn}`} title="Reject Booking">
                                                <X size={20} />
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
