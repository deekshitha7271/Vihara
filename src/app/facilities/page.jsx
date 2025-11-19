'use client';
import React from 'react';
import styles from '@/app/facilities/facilities.module.css';
import { facilitiesData } from './data/facilitiesData';
export default function FacilitiesPage() {
  return (
    <div className={styles.page}>
      {/* Hero section with background image and navbar overlay */}
      <div className={styles.heroSection}>
        <div className={styles.overlay}></div>
        <img src="/resort-4.webp" alt="Resort Background" className={styles.heroImage} />
        <div className={styles.navWrapper}>
        </div>
        <div className={styles.heroContent}>
          <h1>Luxury Facilities</h1>
          <p>Where every resort redefines comfort and experience</p>
        </div>
      </div>

      {/* Facilities list */}
      <div className={styles.container}>
        {facilitiesData.map((resort, index) => (
          <section key={index} className={styles.resortSection}>
            <div
              className={styles.resortHeader}
              style={{ backgroundImage: `url(${resort.image})` }}
            >
              <h2>{resort.resort}</h2>
            </div>
            <div className={styles.facilityGrid}>
              {resort.facilities.map((f, i) => (
                <div key={i} className={styles.card}>
                  <div className={styles.icon}>{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
