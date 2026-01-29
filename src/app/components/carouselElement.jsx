// 'use client'
// import useEmblaCarousel from 'embla-carousel-react'
// import Autoplay from 'embla-carousel-autoplay'
// import Image from 'next/image'
// import { useCallback, useEffect, useState } from 'react'
// import './Carousel.css' 

// export default function Carousel() {
//   const [selectedIndex, setSelectedIndex] = useState(0)
//   const [emblaRef, emblaApi] = useEmblaCarousel(
//     { loop: true, align: 'start', skipSnaps: false },
//     [Autoplay({ delay: 3000 })]
//   )

//   const slides = [
//     { src: '/resort-1.webp', text: 'Luxury by Nature' },
//     { src: '/resort-2.jpg', text: 'Wake Up in Paradise' },
//     { src: '/resort-3.jpg', text: 'Your Escape Awaits' },
//     { src: '/resort-4.webp', text: 'Experience Tranquility' },
//     { src: '/resort-5.webp', text: 'Unwind in Style' },
//   ]

//   const onSelect = useCallback(() => {
//     if (!emblaApi) return
//     setSelectedIndex(emblaApi.selectedScrollSnap())
//   }, [emblaApi])

//   useEffect(() => {
//     if (!emblaApi) return
//     emblaApi.on('select', onSelect)
//     onSelect()
//   }, [emblaApi, onSelect])

//   return (

//     <div className="carousel" ref={emblaRef}>
//   <div className="carousel__container">
//     {slides.map((slide, i) => (
//       <div className="carousel__slide" key={i}>
//         <Image
//           src={slide.src}
//           alt={slide.text}
//           width={1600}
//           height={800}
//           className="carousel__image"
//           priority
//         />
//         <div className="carousel__overlay">
//           <h2
//             className={`carousel__text ${
//               i === selectedIndex ? 'animate-text' : ''
//             }`}
//           >
//             {slide.text}
//           </h2>
//         </div>
//       </div>
//     ))}
//   </div>

//   <div className="carousel__dots">
//     {slides.map((_, i) => (
//       <button
//         key={i}
//         onClick={() => emblaApi?.scrollTo(i)}
//         className={`carousel__dot ${i === selectedIndex ? 'active' : ''}`}
//       />
//     ))}
//   </div>
// </div>

//   )
// }


// "use client";

// import React, { useCallback, useEffect, useState } from "react";
// import useEmblaCarousel from "embla-carousel-react";
// import Autoplay from "embla-carousel-autoplay";
// import Image from "next/image";
// import "./Carousel.css";

// export default function Carousel() {
//   const [selectedIndex, setSelectedIndex] = useState(0);

//   // base slides (text + image fallback)
//   const baseSlides = [
//     { id: 1, text: "Luxury by Nature", image: "/resort-1.webp" },
//     { id: 2, text: "Wake Up in Paradise", image: "/resort-2.jpg" },
//     { id: 3, text: "Your Escape Awaits", image: "/resort-3.jpg" },
//     { id: 4, text: "Experience Tranquility", image: "/resort-4.webp" },
//     { id: 5, text: "Unwind in Style", image: "/resort-5.webp" },
//   ];

//   // pools of optional videos and images you want to randomly pick from
//   // Put video files in public/videos/ and images in public/
//   const VIDEO_POOL = [
//     "/entry.mp4",
//     "/videos/pool-1.webm",
//     "/videos/sunset-loop.mp4",
//   ];

//   const IMAGE_POOL = [
//     "/resort-1.webp",
//     "/resort-2.jpg",
//     "/resort-3.jpg",
//     "/resort-4.webp",
//     "/resort-5.webp",
//   ];

//   // slidesWithMedia will store for each slide either { type: 'video', src } or { type: 'image', src }
//   const [slidesWithMedia, setSlidesWithMedia] = useState([]);

//   // Embla hook — note we only render embla container after slidesWithMedia is ready
//   const [emblaRef, emblaApi] = useEmblaCarousel(
//     { loop: true, align: "start", skipSnaps: false },
//     [Autoplay({ delay: 3000 })]
//   );

//   // onSelect handler
//   const onSelect = useCallback(() => {
//     if (!emblaApi) return;
//     setSelectedIndex(emblaApi.selectedScrollSnap());
//   }, [emblaApi]);

//   useEffect(() => {
//     if (!emblaApi) return;
//     emblaApi.on("select", onSelect);
//     onSelect();
//   }, [emblaApi, onSelect]);

//   // Generate randomized media mapping once on mount
//   useEffect(() => {
//     // run only on client mount
//     const mapped = baseSlides.map(() => {
//       // simple random choice: 60% chance video, 40% image — tweak as needed
//       const chooseVideo = Math.random() < 0.6;

//       if (chooseVideo && VIDEO_POOL.length > 0) {
//         const v = VIDEO_POOL[Math.floor(Math.random() * VIDEO_POOL.length)];
//         return { type: "video", src: v };
//       } else {
//         const img = IMAGE_POOL[Math.floor(Math.random() * IMAGE_POOL.length)];
//         return { type: "image", src: img };
//       }
//     });

//     setSlidesWithMedia(mapped);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []); // only on mount

//   // Render a loading placeholder until slidesWithMedia ready
//   if (slidesWithMedia.length === 0) {
//     return (
//       <div className="carousel carousel--loading" style={{ minHeight: 300 }}>
//         {/* minimal placeholder to avoid layout shift */}
//       </div>
//     );
//   }

//   return (
//     <div className="carousel" ref={emblaRef}>
//       <div className="carousel__container">
//         {slidesWithMedia.map((media, i) => {
//           const slide = baseSlides[i];

//           return (
//             <div className="carousel__slide" key={slide.id}>
//               {media.type === "video" ? (
//                 <video
//                   className="carousel__media"
//                   src={media.src}
//                   autoPlay
//                   muted
//                   loop
//                   playsInline
//                 />
//               ) : (
//                 <Image
//                   src={media.src}
//                   alt={slide.text}
//                   width={1600}
//                   height={800}
//                   className="carousel__image"
//                   priority
//                 />
//               )}

//               <div className="carousel__overlay">
//                 <h2
//                   className={`carousel__text ${
//                     i === selectedIndex ? "animate-text" : ""
//                   }`}
//                 >
//                   {slide.text}
//                 </h2>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <div className="carousel__dots">
//         {slidesWithMedia.map((_, i) => (
//           <button
//             key={i}
//             onClick={() => emblaApi?.scrollTo(i)}
//             className={`carousel__dot ${i === selectedIndex ? "active" : ""}`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

'use client'

import { useEffect, useState } from 'react'
import styles from './Carousel.module.css' // ← module import

export default function RandomHeroVideo() {
  const VIDEOS = [
    "/entry.mp4",
    "/entry2.mp4",

    "/entry5.mp4",
  ];

  const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    const random = VIDEOS[Math.floor(Math.random() * VIDEOS.length)];
    setVideoSrc(random);
  }, []);

  if (!videoSrc) return null;

  return (
    <div className={styles.wrapper}>
      {/* Background Video */}
      <video
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        className={styles.video}
      />

      {/* Overlay Layer (dark tint) */}
      <div className={styles.overlay} />

      {/* Text + Button */}
      <div className={styles.content}>
        <h1 className={styles.title}>Your Stay, Your Story</h1>
        <p className={styles.subtitle}>Experience luxury like never before.</p>
        <button className={styles.button}>
          Explore Resorts →
        </button>
      </div>
    </div>
  );
}
