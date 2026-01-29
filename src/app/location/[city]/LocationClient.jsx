'use client';
import styles from './LocationClient.module.css';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import WeatherComponent from '../../components/WeatherComponent';

// Dynamically import map to avoid SSR issues
const MapComponent = dynamic(() => import('../../components/MapComponent'), {
    ssr: false,
    loading: () => <div style={{ height: '100%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Map...</div>
});

export default function LocationClient({ city, hotels }) {
    // Decode city (e.g. "Thekkady%20..." -> "Thekkady ...") and remove "hotels-in-" logic if any
    // Assuming 'city' comes in clean or needs simple space decoding
    const displayCity = city.replace(/%20/g, ' ');

    return (
        <div className={styles.container}>
            {/* Hero Video Section */}
            <div className={styles.hero}>
                <video
                    className={styles.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="/resort-2.jpg" // Fallback
                >
                    <source src="/entry.mp4" type="video/mp4" />
                </video>
                <div className={styles.overlay} />

                <div className={styles.heroContent}>
                    <div className={styles.superTitle}>DISCOVER LUXURY IN</div>
                    <h1 className={styles.title}>{displayCity}</h1>
                </div>
            </div>

            {/* Content Section */}
            <div className={styles.contentInner}>

                {hotels.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
                        <h2>No properties found currently</h2>
                        <p>We are expanding our collection in {displayCity} soon.</p>
                    </div>
                ) : (
                    <div className={styles.splitLayout}>
                        {/* LEFT: Hotel List */}
                        <div className={styles.list}>
                            {hotels.map((hotel) => (
                                <Link key={hotel._id} href={`/detail/${hotel._id}`} className={styles.card}>
                                    <div className={styles.imageWrapper}>
                                        <Image
                                            src={hotel.image}
                                            alt={hotel.name}
                                            fill
                                            className={styles.image}
                                            sizes="(max-width: 900px) 100vw, 800px"
                                            priority
                                        />
                                    </div>
                                    <div className={styles.details}>
                                        <div className={styles.category}>{hotel.category || "Luxury Stay"}</div>
                                        <h2 className={styles.hotelName}>{hotel.name}</h2>
                                        <p className={styles.description}>
                                            {hotel.description || "Experience refined luxury at its best. This property offers world-class amenities and breathtaking views for an unforgettable stay."}
                                        </p>

                                        <div className={styles.location}>
                                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {hotel.location}
                                        </div>

                                        <div className={styles.footer}>
                                            <div className={styles.price}>
                                                ₹{hotel.price} <span>/ night</span>
                                            </div>
                                            <div className={styles.cta}>View Details</div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>



                        {/* RIGHT: Sidebar (Map + Weather) */}
                        <div className={styles.sidebar}>
                            <div className={styles.mapContainer}>
                                <MapComponent hotels={hotels} />
                            </div>

                            {/* Live Weather Widget */}
                            {hotels.length > 0 && (
                                <WeatherComponent
                                    lat={hotels[0].lat || 9.93}
                                    lng={hotels[0].lng || 76.26}
                                    city={displayCity}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
