'use client';

import { updateBookingStatusAction } from "@/app/serverActions/bookingActions";
import { Check, X } from "lucide-react";
import styles from "./bookings.module.css";
// Removed SweetAlert

export default function BookingActions({ bookingId }) {

    const handleAction = async (status) => {
        try {
            const isConfirmed = window.confirm(`Are you sure you want to ${status.toLowerCase()} this booking?`);

            if (isConfirmed) {
                const actionResult = await updateBookingStatusAction(bookingId, status);
                if (actionResult.success) {
                    alert(`${status} successfully!`);
                    window.location.reload();
                } else {
                    alert(`Error: ${actionResult.message}`);
                }
            }
        } catch (error) {
            console.error(error);
            alert('Action failed');
        }
    };

    return (
        <>
            <button
                className={`${styles.btn} ${styles.acceptBtn}`}
                title="Accept Booking"
                onClick={() => handleAction('CONFIRMED')}
            >
                <Check size={20} />
            </button>
            <button
                className={`${styles.btn} ${styles.rejectBtn}`}
                title="Reject Booking"
                onClick={() => handleAction('CANCELLED')}
            >
                <X size={20} />
            </button>
        </>
    );
}
