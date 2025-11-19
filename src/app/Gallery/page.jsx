'use client'
import React, { useCallback, useState, useEffect } from 'react'
import Image from 'next/image'
import UserNavigation from '@/app/components/UserNavigation'
import styles from './Gallery.module.css'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

const resorts = [
  {
    name: 'Dindi Resorts',
    images: [
      '/gallery-1.1.jpeg',
      '/gallery-1.2.jpeg',
      '/gallery-1.3.avif',
      '/gallery-1.4.jpg'
    ]
  },
  {
    name: 'Palavelli Resorts',
    images: [
      '/gallery-2.1.jpg',
      '/gallery-2.2.jpg',
      '/gallery-2.3.jpg',
      '/gallery-2.4.jpg'
    ]
  }
]

function ResortCarousel({ resort }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 1
    },
    [Autoplay({ delay: 3000 })]
  )

  return (
    <div className={styles.resortSection}>
      <h2 className={styles.sectionTitle}>{resort.name}</h2>

      <div className={styles.carousel} ref={emblaRef}>
        <div className={styles.carouselContainer}>
          {resort.images.map((img, idx) => (
            <div className={styles.carouselSlide} key={idx}>
              <Image
                src={img}
                alt={`${resort.name} ${idx}`}
                width={600}
                height={400}
                className={styles.carouselImage}
                priority
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Gallery() {
  return (
    <div className={styles.galleryPage}>
      <div className={styles.heroSection}>
        {/* <UserNavigation /> */}
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroText}>Discover Our Resorts</h1>
        </div>
      </div>

      {resorts.map((resort, index) => (
        <ResortCarousel key={index} resort={resort} />
      ))}
    </div>
  )
}
