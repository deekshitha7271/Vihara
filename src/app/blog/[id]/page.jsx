'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import UserNavigation from '@/app/components/UserNavigation'
import styles from '@/app/blog/[id]/singleBlog.module.css'

export default function SingleBlogPage() {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)

  const blogs = [
    {
      id: '1',
      title: 'Whispers of the Western Ghats',
      image: '/wayanad1.jpg',
      author: 'Wayanad Explorer',
      content: `
        Wayanad — a place where nature breathes poetry.
        As dawn breaks, the air hums with bird songs, and mist wraps the forests like a living spirit.
        Trekking here feels like walking through pages of an unwritten story.
        Every waterfall whispers secrets of the mountains.
        Le Villagio isn’t just a stay — it’s a pause button on time.
      `
    },
    {
      id: '2',
      title: 'When Nature Writes Poetry',
      image: '/wayanad2.jpg',
      author: 'Forest Wanderer',
      content: `
        The forest speaks softly to those who listen.
        Each rustle, each beam of sunlight filtering through emerald canopies, writes its own stanza.
        Here in Wayanad, you don’t just witness beauty — you feel it pulse beneath your feet.
        The domes at Le Villagio blend seamlessly into this poetry of peace.
      `
    },
    {
      id: '3',
      title: 'The Secret Trails of Le Villagio',
      image: '/wayanad3.jpg',
      author: 'Adventure Spirit',
      content: `
        Beyond the domes, secret trails lead to hidden treasures.
        Streams hum lullabies as they weave through mossy stones.
        The adventure isn’t loud — it’s soulful.
        Each step invites reflection, connection, and wonder.
      `
    }
  ]

  useEffect(() => {
    const found = blogs.find(b => b.id === id)
    setBlog(found)
  }, [id])

  if (!blog) return <p>Loading...</p>

  return (
    <div className={styles.singleBlogPage}>
      <UserNavigation />

      <div
        className={styles.hero}
        style={{ backgroundImage: `url(${blog.image})` }}
      >
        <div className={styles.overlay}></div>
        <div className={styles.heroContent}>
          <h1>{blog.title}</h1>
          <p>by {blog.author}</p>
        </div>
      </div>

      <section className={styles.contentSection}>
        <div className={styles.blogText}>
          <p>{blog.content}</p>
        </div>
      </section>
    </div>
  )
}
