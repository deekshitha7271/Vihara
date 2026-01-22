// components/SectionBackground.jsx
"use client";

import { useEffect, useState } from "react";
import styles from "./SectionBackground.module.css";

/**
 * Props:
 *  - media: [{ type: "video"|"image", src: string, alt?: string }]
 *  - children: JSX (content to render on top of the background)
 */
export default function SectionBackground({ media = [], children }) {
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    if (!media || media.length === 0) return;
    const idx = Math.floor(Math.random() * media.length);
    setCurrent(media[idx]);
  }, [media]);

  if (!current) return null;

  return (
    <section className={styles.wrapper} aria-label="featured section">
      {current.type === "video" ? (
        <video
          className={styles.background}
          src={current.src}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
      ) : (
        <img className={styles.background} src={current.src} alt={current.alt || "background"} />
      )}

      <div className={styles.overlay} />

      <div className={styles.content}>
        {children}
      </div>
    </section>
  );
}
