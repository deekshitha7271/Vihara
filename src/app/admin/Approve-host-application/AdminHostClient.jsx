'use client';
import { useState } from 'react';
import styles from '../admin.module.css';
import { approveHostAction, rejectHostAction } from '@/app/serverActions/adminActions';
import Swal from 'sweetalert2';

export default function AdminHostClient({ applications }) {
    const [apps, setApps] = useState(applications);

    const handleStatusUpdate = async (id, status, name) => {
        try {
            const result = await Swal.fire({
                title: `Are you sure?`,
                text: `Do you want to ${status} ${name}'s application?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: `Yes, ${status} it!`
            });

            if (result.isConfirmed) {
                let actionResult;
                if (status === 'approve') {
                    actionResult = await approveHostAction(id);
                } else {
                    actionResult = await rejectHostAction(id);
                }

                if (actionResult.success) {
                    Swal.fire(
                        'Success!',
                        actionResult.message,
                        'success'
                    );
                    // Refresh list locally
                    setApps(apps.filter(app => app._id !== id));
                } else {
                    Swal.fire(
                        'Error!',
                        actionResult.message,
                        'error'
                    );
                }
            }
        } catch (error) {
            console.error("Confirmation error", error);
            Swal.fire(
                'Error!',
                'An unexpected error occurred.',
                'error'
            );
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Host Applications</h1>
            </header>

            {apps.length === 0 ? (
                <div className={styles.empty}>
                    <p>No new host applications to review.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {apps.map(app => (
                        <div key={app._id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div>
                                    <h3 className={styles.cardTitle}>{app.userId.username}</h3>
                                    <p className={styles.cardSubtitle}>{app.userId.email}</p>
                                </div>
                            </div>

                            <div className={styles.infoRow}>
                                <span className={styles.label}>Experience</span>
                                <span className={styles.value}>{app.hostingExperience}</span>
                            </div>

                            <div className={styles.infoRow}>
                                <span className={styles.label}>Reason</span>
                                <span className={styles.value}>{app.hostingReason}</span>
                            </div>

                            <div className={styles.infoRow}>
                                <span className={styles.label}>Location</span>
                                <span className={styles.value}>{app.city}</span>
                            </div>

                            <div className={styles.actions}>
                                <button className={styles.rejectBtn} onClick={() => handleStatusUpdate(app._id, 'reject', app.userId.username)}>
                                    Reject
                                </button>
                                <button className={styles.approveBtn} onClick={() => handleStatusUpdate(app._id, 'approve', app.userId.username)}>
                                    Approve Host
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}