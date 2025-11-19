'use client'
import React, { useEffect } from 'react'
import styles from '@/app/blog/blog.module.css'
import Link from 'next/link'

export default function BlogPage() {
  useEffect(() => {
    const handleScroll = () => {
      const hero = document.querySelector(`.${styles.heroSection}`)
      if (hero) hero.style.backgroundPositionY = `${window.scrollY * 0.4}px`
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // === Grouped Blogs by Place ===
  const blogSections = [
    {
      place: 'Wayanad',
      heroImage: '/gallery-2.1.jpg',
      tagline: 'Whispers of the Western Ghats',
      blogs: [
        {
          id: 1,
          title: 'Whispers of the Western Ghats',
          image: '/gallery-2.2.jpg',
          excerpt: 'The mist dances with the sun here...',
          author: 'Wayanad Explorer'
        },
        {
          id: 2,
          title: 'When Nature Writes Poetry',
          image: '/gallery-2.3.jpg',
          excerpt: 'Every leaf is a line of verse...',
          author: 'Forest Wanderer'
        }
      ]
    },
    {
      place: 'Dindi',
      heroImage: 'gallery-1.3.avif',
      tagline: 'Where the Godavari meets serenity',
      blogs: [
        {
          id: 3,
          title: 'The Backwaters of Bliss',
          image: '/gallery-2.1.jpg',
          excerpt: 'Sail through silence where the river hums...',
          author: 'River Dreamer'
        },
        {
          id: 4,
          title: 'Mangrove Mornings',
          image: '/gallery-2.1.jpg',
          excerpt: 'Every dawn glows over gentle waves...',
          author: 'Eco Soul'
        }
      ]
    },
    {
      place: 'Palavelli',
      heroImage: '/gallery-2.1.jpg',
      tagline: 'The art of luxury by the lake',
      blogs: [
        {
          id: 5,
          title: 'Golden Reflections',
          image: '/gallery-2.1.jpg',
          excerpt: 'Sunsets so perfect they could be painted...',
          author: 'Travel Muse'
        },
        {
          id: 6,
          title: 'The Floating Paradise',
          image: '/gallery-2.1.jpg',
          excerpt: 'Where every ripple tells a story of peace...',
          author: 'Sky Wanderer'
        }
      ]
    }
  ]

  return (
    <div className={styles.page}>
      {/* Global Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.overlay}></div>
        <div className={styles.heroContent}>
          <h1>Resort Tales</h1>
          <p>Stories from the most breathtaking destinations</p>
        </div>
      </div>

      {/* Loop through all places */}
      {blogSections.map((section, idx) => (
        <section key={idx} className={styles.placeSection}>
          <div
            className={styles.placeHero}
            style={{ backgroundImage: `url(${section.heroImage})` }}
          >
            <div className={styles.placeOverlay}></div>
            <div className={styles.placeTitle}>
              <h2>{section.place}</h2>
              <p>{section.tagline}</p>
            </div>
          </div>

          <div className={styles.blogGrid}>
            {section.blogs.map(blog => (
              <div key={blog.id} className={styles.blogCard}>
                <img src={blog.image} alt={blog.title} />
                <div className={styles.cardOverlay}>
                  <h2>{blog.title}</h2>
                  <p>{blog.excerpt}</p>
                  <Link href={`/blog/${blog.id}`} className={styles.readMore}>
                    Read Story
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
