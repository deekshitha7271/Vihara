'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

export default function AdminDashboard() {
  const [pendingHotels, setPendingHotels] = useState([]);

 

  const fetchPendingHotels = async () => {
    const res = await fetch("/api/admin/pending-hotels");
    const data = await res.json();
    setPendingHotels(data.data || []);
  };
   useEffect(() => {
    fetchPendingHotels();
  }, []);

  const updateStatus = async (hotelId, status) => {
    await fetch("/api/admin/update-hotel-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hotelId, status })
    });

    // Remove hotel from list after action
    setPendingHotels((prev) =>
      prev.filter((hotel) => hotel._id !== hotelId)
    );
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Admin Dashboard – Pending Hotels</h1>

      {pendingHotels.length === 0 && (
        <p>No pending hotels</p>
      )}

      {pendingHotels.map((hotel) => (
        <div
          key={hotel._id}
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "20px",
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "12px"
          }}
        >
          <Image
            src={hotel.image}
            alt={hotel.name}
            width={200}
            height={140}
            style={{ borderRadius: "10px", objectFit: "cover" }}
          />

          <div style={{ flex: 1 }}>
            <h3>{hotel.name}</h3>
            <p><b>Location:</b> {hotel.location}</p>
            <p><b>Category:</b> {hotel.category}</p>
            <p><b>Price:</b> ₹{hotel.price}</p>

            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => updateStatus(hotel._id, "APPROVED")}
                style={{
                  marginRight: "10px",
                  background: "green",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "6px"
                }}
              >
                Approve
              </button>

              <button
                onClick={() => updateStatus(hotel._id, "REJECTED")}
                style={{
                  background: "red",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "6px"
                }}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
