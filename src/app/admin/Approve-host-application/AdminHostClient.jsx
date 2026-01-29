'use client';
import styles from '../admin.module.css';

export default function AdminHostClient({ applications }) {

    const handleApprove = async (applicationId) => {
        try {
            const res = await fetch('/api/admin/approve-host', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId })
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message || 'Application approved successfully');
                window.location.reload();
            } else {
                alert(data.message || 'Failed to approve application');
            }
        } catch (error) {
            console.error("Approval error:", error);
            alert("An error occurred while approving.");
        }
    }

    const handleReject = async (applicationId) => {
        try {
            const res = await fetch('/api/admin/reject-host', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId })
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message || 'Application rejected successfully');
                window.location.reload();
            } else {
                alert(data.message || 'Failed to reject application');
            }
        } catch (error) {
            console.error("Rejection error:", error);
            alert("An error occurred while rejecting.");
        }
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Host Applications</h1>
            </header>

            {applications.length === 0 ? (
                <div className={styles.empty}>
                    <p>No new host applications to review.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {applications.map(app => (
                        <div key={app._id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div>
                                    <h3 className={styles.cardTitle}>{app.userId.username}</h3>
                                    <p className={styles.cardSubtitle}>{app.userId.email}</p>
                                </div>
                            </div>

                            <div className={styles.infoRow}>
                                <span className={styles.label}>Property Name</span>
                                <span className={styles.value}>{app.propertyName}</span>
                            </div>

                            <div className={styles.infoRow}>
                                <span className={styles.label}>Location</span>
                                <span className={styles.value}>{app.city}</span>
                            </div>

                            <div className={styles.actions}>
                                <button className={styles.rejectBtn} onClick={() => handleReject(app._id)}>
                                    Reject
                                </button>
                                <button className={styles.approveBtn} onClick={() => handleApprove(app._id)}>
                                    Approve Host
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}