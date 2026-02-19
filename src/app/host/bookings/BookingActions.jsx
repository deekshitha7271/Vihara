'use client';

import { updateBookingStatusAction } from "@/app/serverActions/bookingActions";
import { Check, X } from "lucide-react";
import styles from "./bookings.module.css";
import Swal from "sweetalert2";

export default function BookingActions({ bookingId }) {

    const handleAction = async (status) => {
        try {
            const result = await Swal.fire({
                title: `Are you sure?`,
                text: `Do you want to ${status.toLowerCase()} this booking?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: status === 'CONFIRMED' ? '#28a745' : '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: `Yes, ${status.toLowerCase()} it!`
            });

            if (result.isConfirmed) {
                const actionResult = await updateBookingStatusAction(bookingId, status);
                if (actionResult.success) {
                    Swal.fire('Success', actionResult.message, 'success');
                } else {
                    Swal.fire('Error', actionResult.message, 'error');
                }
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Action failed', 'error');
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
