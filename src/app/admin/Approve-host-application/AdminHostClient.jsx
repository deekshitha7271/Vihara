'use client';
import { useState } from 'react';
import styles from '../admin.module.css';
import { approveHostAction, rejectHostAction } from '@/app/serverActions/adminActions';

export default function AdminHostClient({ applications }) {
    const [apps, setApps] = useState(applications);

    const handleStatusUpdate = async (id, status, name) => {
        try {
            const isConfirmed = window.confirm(`Are you sure you want to ${status} ${name}'s application?`);

            if (isConfirmed) {
                let actionResult;
                if (status === 'approve') {
                    actionResult = await approveHostAction(id);
                } else {
                    actionResult = await rejectHostAction(id);
                }

                if (actionResult.success) {
                    alert(`${status} successful!`);
                    setApps(apps.filter(app => app._id !== id));
                } else {
                    alert(`Error: ${actionResult.message}`);
                }
            }
        } catch (error) {
            console.error(error);
            alert('An unexpected error occurred.');
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