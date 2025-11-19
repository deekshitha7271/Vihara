'use client'
import React from 'react'
import styles from '@/app/Contact/Contact.module.css'
import Image from 'next/image'

export default function ContactPage() {
  return (
    <>
      

      <section className={styles.bannerSection}>
        <Image
          src="/bg-resort-2.jpeg"
      alt="Resort Banner"
      fill
      priority
      quality={100}
      className={styles.bannerImage}
        />
        <div className={styles.bannerOverlay}>
          <h1>Contact Us</h1>
          <p>We’d love to hear from you!</p>
        </div>
      </section>

      <section className={styles.contactSection}>
        <h2 className={styles.sectionTitle}>Contact Vihara, Resort Booking Platform</h2>
        <div className={styles.underline}></div>

        <div className={styles.contactContainer}>
          <div className={styles.contactInfo}>
            <h3>Get in Touch</h3>
            <p>
              📍 <strong>Vihara</strong> <br />
              vizag, AndhraPradesh
            </p>
            <p>📞 +91 9446 976 000</p>
            <p>✉️ info@vihararesort.com</p>

            {/* <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!..."
              loading="lazy"
              className={styles.map}
            ></iframe> */}
          </div>

          
          <div className={styles.contactForm}>
            <h3>Send us a Message</h3>
            <form>
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <textarea placeholder="Your Message" rows="5"></textarea>
              <button type="submit">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
