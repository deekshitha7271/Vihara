'use client';

import Link from 'next/link';
import styles from './UserNavigation.module.css';
import { useSession, signOut } from 'next-auth/react';
import BecomeHost from '@/app/components/BecomeHostButton';

export default function UserNavigation() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  const role = session?.user?.role;

  return (
    <header className={styles.navbar}>
      <nav className={styles.navbar__links}>
        <Link href="/">HOME</Link>
        <Link href="/resorts">RESORT</Link>
        <Link href="/facilities">FACILITIES</Link>
        <Link href="/gallery">GALLERY</Link>
        <Link href="/blog">BLOG</Link>
        <Link href="/contact">CONTACT</Link>
      </nav>

      <div className={styles.navbar__links}>
        {/* Not logged in */}
        {!session && <Link href="/login">Login</Link>}

        {/* USER */}
        {session && role === "user" && (
          <BecomeHost user={session.user} />
        )}

        {/* HOST */}
        {session && role === "host" && (
          <Link href="/host/dashboard">
            <button className={styles.hostButton}>
              Host Dashboard
            </button>
          </Link>
        )}

        {/* LOGOUT */}
        {session && (
          <button 
            onClick={() => signOut({ redirectTo: '/login' })}
            className={styles.logoutBtn}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
