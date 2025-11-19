'use client'
import Link from 'next/link'
import styles from './UserNavigation.module.css'
import { FaPhoneAlt } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import Image from 'next/image'

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      
      {/* <div className={styles.navbar__logo}>
        <Image src="/logo.png" alt="Vihara Resort Logo" height={200} width={200}/>
      </div> */}

      {/* Center: Links */}
      <nav className={styles.navbar__links}>
        <Link href="/">HOME</Link>
        <Link href="/resort">RESORT</Link>
        <Link href="/domes">DOMES</Link>
        <Link href="/tariff">TARIFF</Link>
        <Link href="/facilities">FACILITIES</Link>
        <Link href="/Gallery">GALLERY</Link>
        <Link href="/places">PLACES</Link>
        <Link href="/blog">BLOG</Link>
        <Link href="/Contact">CONTACT</Link>

      </nav>

      {/* Right: Contact Info */}
      <div className="navbar__contact">
        <span><FaPhoneAlt /> +91 9446 976 000</span>
        <span><MdEmail /> info@vihararesort.com</span>
      </div>
      <div>
        <Link href='/api/auth/signout'>Logout</Link>
      </div>
    </header>
  )
}
