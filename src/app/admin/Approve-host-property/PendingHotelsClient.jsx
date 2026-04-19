'use client';

import { useState } from "react";
import Image from "next/image";
import styles from "../admin.module.css";
import { updateHotelStatusAction } from "@/app/serverActions/adminActions";

export default function PendingHotelsClient({ hotels }) {
    const [pendingHotels, setPendingHotels] = useState(hotels);

    const updateStatus = async (hotelId, status) => {
        try {
            const isConfirmed = window.confirm(`Are you sure you want to ${status.toLowerCase()} this property?`);

            if (isConfirmed) {
                const actionResult = await updateHotelStatusAction(hotelId, status);

                if (actionResult.success) {
                    alert(`${status} successfully!`);
                    setPendingHotels((prev) =>
                        prev.filter((hotel) => hotel._id !== hotelId)
                    );
                } else {
                    alert(`Error: ${actionResult.message}`);
                }
            }
        } catch (e) {
            console.error(e);
            alert('An unexpected error occurred');
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Pending Property Approvals</h1>
            </header>

            {pendingHotels.length === 0 ? (
                <div className={styles.empty}>
                    <p>No pending properties to review.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {pendingHotels.map((hotel) => (
                        <div key={hotel._id} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={hotel.image}
                                    alt={hotel.name}
                                    fill
                                    className={styles.image}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>

                            <div className={styles.cardHeader}>
                                <div>
                                    <h3 className={styles.cardTitle}>{hotel.name}</h3>
                                    <p className={styles.cardSubtitle}>{hotel.location}</p>
                                </div>
                            </div>

                            <div className={styles.infoRow}>
                                <span className={styles.label}>Category</span>
                                <span className={styles.value}>{hotel.category}</span>
                            </div>

                            <div className={styles.infoRow}>
                                <span className={styles.label}>Price/Night</span>
                                <span className={styles.value}>₹{hotel.price}</span>
                            </div>

                            <div className={styles.actions}>
                                <button
                                    className={styles.rejectBtn}
                                    onClick={() => updateStatus(hotel._id, "REJECTED")}
                                >
                                    Reject
                                </button>
                                <button
                                    className={styles.approveBtn}
                                    onClick={() => updateStatus(hotel._id, "APPROVED")}
                                >
                                    Approve Property
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
