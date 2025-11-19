'use client'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import './Carousel.css' 

export default function Carousel() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', skipSnaps: false },
    [Autoplay({ delay: 3000 })]
  )

  const slides = [
    { src: '/resort-1.webp', text: 'Luxury by Nature' },
    { src: '/resort-2.jpg', text: 'Wake Up in Paradise' },
    { src: '/resort-3.jpg', text: 'Your Escape Awaits' },
    { src: '/resort-4.webp', text: 'Experience Tranquility' },
    { src: '/resort-5.webp', text: 'Unwind in Style' },
  ]

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    onSelect()
  }, [emblaApi, onSelect])

  return (
    
    <div className="carousel" ref={emblaRef}>
  <div className="carousel__container">
    {slides.map((slide, i) => (
      <div className="carousel__slide" key={i}>
        <Image
          src={slide.src}
          alt={slide.text}
          width={1600}
          height={800}
          className="carousel__image"
          priority
        />
        <div className="carousel__overlay">
          <h2
            className={`carousel__text ${
              i === selectedIndex ? 'animate-text' : ''
            }`}
          >
            {slide.text}
          </h2>
        </div>
      </div>
    ))}
  </div>

  <div className="carousel__dots">
    {slides.map((_, i) => (
      <button
        key={i}
        onClick={() => emblaApi?.scrollTo(i)}
        className={`carousel__dot ${i === selectedIndex ? 'active' : ''}`}
      />
    ))}
  </div>
</div>

  )
}
