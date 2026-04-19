'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./HostSidebar.module.css";
import {
    LayoutDashboard,
    Building2,
    CalendarCheck,
    CreditCard,
    Settings,
    LogOut
} from "lucide-react";

import { logoutAction } from "../serverActions/logoutAction";

export default function HostSidebar({ username }) {
    const pathname = usePathname();

    const isActive = (path) => pathname === path;

    return (
        <div className={styles.sidebar}>
            <Link href="/host/dashboard" className={styles.logo}>
                <Building2 size={28} /> Vihara Host
            </Link>

            <nav className={styles.nav}>
                <Link
                    href="/host/dashboard"
                    className={`${styles.navItem} ${isActive('/host/dashboard') ? styles.active : ''}`}
                >
                    <LayoutDashboard size={20} /> Dashboard
                </Link>
                <Link
                    href="/host/my-hotels"
                    className={`${styles.navItem} ${isActive('/host/my-hotels') ? styles.active : ''}`}
                >
                    <Building2 size={20} /> My Hotels
                </Link>
                <Link
                    href="/host/bookings"
                    className={`${styles.navItem} ${isActive('/host/bookings') ? styles.active : ''}`}
                >
                    <CalendarCheck size={20} /> Bookings
                </Link>
                <Link
                    href="/host/earnings"
                    className={`${styles.navItem} ${isActive('/host/earnings') ? styles.active : ''}`}
                >
                    <CreditCard size={20} /> Earnings
                </Link>
                <Link
                    href="/host/settings"
                    className={`${styles.navItem} ${isActive('/host/settings') ? styles.active : ''}`}
                >
                    <Settings size={20} /> Settings
                </Link>
            </nav>


            <div className={styles.userProfile}>
                <div className={styles.avatar}>
                    {username ? username[0].toUpperCase() : 'H'}
                </div>
                <div className={styles.hostInfo}>
                    <p className={styles.hostName}>{username || 'Host'}</p>
                    <p className={styles.hostRole}>Host Account</p>
                </div>
                <div
                    onClick={() => logoutAction()}
                    className={styles.logoutBtn}
                    title="Logout"
                >
                    <LogOut size={20} color="#d32f2f" />
                </div>
            </div>
        </div>
    );
}
