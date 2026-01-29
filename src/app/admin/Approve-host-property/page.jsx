'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../admin.module.css";

export default function AdminDashboard() {
  const [pendingHotels, setPendingHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingHotels = async () => {
    try {
      const res = await fetch("/api/admin/pending-hotels");
      const data = await res.json();
      setPendingHotels(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingHotels();
  }, []);

  const updateStatus = async (hotelId, status) => {
    try {
      const res = await fetch("/api/admin/update-hotel-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotelId, status })
      });
      if (res.ok) {
        // Remove hotel from list after action
        setPendingHotels((prev) =>
          prev.filter((hotel) => hotel._id !== hotelId)
        );
      } else {
        alert("Failed to update status");
      }
    } catch (e) {
      alert("Error processing request");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Pending Property Approvals</h1>
      </header>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>Loading...</p>
      ) : pendingHotels.length === 0 ? (
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
                  style={{ objectFit: "cover" }}
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
