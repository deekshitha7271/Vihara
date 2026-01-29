import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import HostSidebar from "@/app/components/HostSidebar";
import styles from "./hostDashboard.module.css";
import {
    Plus,
    TrendingUp,
    Users,
    Star,
    Clock,
    Building2 // Keep for quick action icons if needed, but not for sidebar
} from "lucide-react";

export default async function HostDasboard() {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    // PENDING STATE
    if (session.user.role !== 'host') {
        return (
            <div className={styles.pendingContainer}>
                <div className={styles.pendingCard}>
                    <div className={styles.pendingIcon}>
                        <Clock size={40} />
                    </div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 800, color: '#1a1a1a' }}>Application Pending</h1>
                    <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                        Thanks for applying to become a Vihara Host, <strong>{session.user.username}</strong>! <br />
                        We are currently reviewing your application. You will be notified once approved.
                    </p>
                    <a href="/" style={{
                        color: 'rgb(3, 107, 90)',
                        textDecoration: 'none',
                        fontWeight: 600,
                        borderBottom: '2px solid rgb(3, 107, 90)',
                        paddingBottom: '2px'
                    }}>
                        Return to Home
                    </a>
                </div>
            </div>
        );
    }

    // ACTIVE HOST DASHBOARD
    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <HostSidebar username={session.user.username} />

            {/* Main Content */}
            <div className={styles.main}>
                <div className={styles.header}>
                    <div className={styles.welcomeText}>
                        <h1>Welcome back, {session.user.username}</h1>
                        <p>Here's what's happening with your properties today.</p>
                    </div>
                    <a href="/host/add-hotel" className={styles.addBtn}>
                        <Plus size={18} /> Add New Hotel
                    </a>
                </div>

                {/* Quick Stats */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <div className={styles.statIcon}>
                                <TrendingUp size={24} />
                            </div>
                            <span style={{ color: '#666', fontWeight: 600, fontSize: '0.85rem' }}>+12%</span>
                        </div>
                        <div className={styles.statValue}>₹0.00</div>
                        <div className={styles.statLabel}>Total Earnings</div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <div className={styles.statIcon}>
                                <Users size={24} />
                            </div>
                        </div>
                        <div className={styles.statValue}>0</div>
                        <div className={styles.statLabel}>Active Bookings</div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <div className={styles.statIcon}>
                                <Star size={24} />
                            </div>
                        </div>
                        <div className={styles.statValue}>5.0</div>
                        <div className={styles.statLabel}>Overall Rating</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <h2 className={styles.sectionTitle}>Quick Actions</h2>
                <div className={styles.actionGrid}>
                    <a href="/host/add-hotel" className={styles.actionCard}>
                        <div className={styles.actionIcon}>
                            <Plus size={28} />
                        </div>
                        <div>
                            <h3 style={{ fontWeight: 700, marginBottom: '4px' }}>List a new property</h3>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>Start earning by adding a new hotel or stay.</p>
                        </div>
                    </a>

                    <a href="/host/my-hotels" className={styles.actionCard}>
                        <div className={styles.actionIcon}>
                            <Building2 size={28} />
                        </div>
                        <div>
                            <h3 style={{ fontWeight: 700, marginBottom: '4px' }}>Manage Properties</h3>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>View and edit your existing listings.</p>
                        </div>
                    </a>
                </div>

            </div>
        </div>
    );
}