// 'use client'
// import Link from 'next/link'
// import styles from './UserNavigation.module.css'
// import { FaPhoneAlt } from 'react-icons/fa'
// import { MdEmail } from 'react-icons/md'
// import Image from 'next/image'

// export default function Navbar() {
//   return (
//     <header className={styles.navbar}>
      
//       {/* <div className={styles.navbar__logo}>
//         <Image src="/logo.png" alt="Vihara Resort Logo" height={200} width={200}/>
//       </div> */}

//       {/* Center: Links */}
//       <nav className={styles.navbar__links}>
//         <Link href="/">HOME</Link>
//         <Link href="/resort">RESORT</Link>
//         {/* <Link href="/domes">DOMES</Link>
//         <Link href="/tariff">TARIFF</Link> */}
//         <Link href="/facilities">FACILITIES</Link>
//         <Link href="/Gallery">GALLERY</Link>
//         {/* <Link href="/places">PLACES</Link> */}
//         <Link href="/blog">BLOG</Link>
//         <Link href="/Contact">CONTACT</Link>

//       </nav>

//       {/* Right: Contact Info */}
//       <div className={styles.navbar__contact}>
//   <div className="contact-item">
//     <FaPhoneAlt />
//     <span className="contact-text">+91 9446 976 000</span>
//   </div>

//   <div className="contact-item">
//     <MdEmail />
//     <span className="contact-text">info@vihararesort.com</span>
//   </div>
// </div>


//       <div  className={styles.navbar__links}>
//         <Link href='/api/auth/signout'>Logout</Link>
//       </div>
//     </header>
//   )
// }

'use client';

import Link from 'next/link';
import styles from './UserNavigation.module.css';
import { useSession } from 'next-auth/react';
import BecomeHost from '@/app/components/BecomeHostButton';

export default function UserNavigation() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  const role = session?.user?.role;

  return (
    <header className={styles.navbar}>
      <nav className={styles.navbar__links}>
        <Link href="/">HOME</Link>
        <Link href="/resort">RESORT</Link>
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
          <Link href="/api/auth/signout">Logout</Link>
        )}
      </div>
    </header>
  );
}
