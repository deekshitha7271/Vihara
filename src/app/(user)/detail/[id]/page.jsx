import { auth } from "@/app/auth";
import DBConnection from "@/app/utils/config/db";
import HotelModel from "@/app/utils/models/hotel";
import UserModel from "@/app/utils/models/User";
import styles from "./detail.module.css";
import Image from "next/image";
import { Star, Share, Heart, MapPin, ShieldCheck, Wifi, Coffee, Utensils, Award, Grid } from "lucide-react";
import MapWrapper from "./MapWrapper";
import ThingsToKnow from "./ThingsToKnow";
import BookingSidebar from "@/app/components/BookingSidebar";

export default async function HotelDetailPage({ params }) {
    const { id } = await params;
    await DBConnection();

    const hotel = await HotelModel.findById(id);

    if (!hotel) {
        return <div className={styles.notFound}>Property not found</div>;
    }

    // Fetch Host Info
    const host = await UserModel.findById(hotel.ownerId);

    // Prepare images for grid
    const mainImage = hotel.image;
    // If gallery exists use it, otherwise fill with main image (placeholder logic)
    const otherImages = hotel.images && hotel.images.length >= 4
        ? hotel.images.slice(0, 4)
        : [mainImage, mainImage, mainImage, mainImage];

    // Clean Amenities
    const amenitiesList = hotel.amenities || [];
    const facilities = hotel.facilities || { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 };
    const checkInTime = hotel.checkInTime || "14:00";
    const checkOutTime = hotel.checkOutTime || "11:00";
    const houseRules = hotel.houseRules || [];

    // Serialize for Client Component
    const serializedHotel = {
        _id: hotel._id.toString(),
        name: hotel.name,
        image: hotel.image,
        description: hotel.description,
        price: hotel.price,
        location: hotel.location,
        category: hotel.category,
        lat: hotel.lat,
        lng: hotel.lng,
        shortDescription: hotel.shortDescription,
        checkInTime: hotel.checkInTime,
        checkOutTime: hotel.checkOutTime,
        facilities: JSON.parse(JSON.stringify(hotel.facilities || {})),
        houseRules: JSON.parse(JSON.stringify(hotel.houseRules || []))
    };

    return (
        <div className={styles.container}>
            {/* Title Header */}
            <header className={styles.header}>
                <h1 className={styles.title}>{hotel.name}</h1>
                <div className={styles.meta}>
                    <div className={styles.metaLeft}>
                        <span className={styles.rating}>
                            <Star size={14} fill="black" /> 5.0 · <span>7 reviews</span>
                        </span>
                        <span>·</span>
                        <span className={styles.location}>{hotel.location}</span>
                    </div>
                    <div className={styles.actions}>
                        <button className={styles.actionBtn}>
                            <Share size={16} /> Share
                        </button>
                        <button className={styles.actionBtn}>
                            <Heart size={16} /> Save
                        </button>
                    </div>
                </div>
            </header>

            {/* Image Gallery */}
            <div className={styles.gallery}>
                <div className={styles.mainImage}>
                    <Image src={mainImage} alt="Main View" fill className={styles.coverImage} />
                </div>
                {otherImages.map((img, idx) => (
                    <div key={idx} className={styles.sideImage}>
                        <Image src={img} alt={`Gallery ${idx}`} fill className={styles.coverImage} />
                    </div>
                ))}
                <button className={styles.showPhotosBtn}>
                    <Grid size={16} /> Show all photos
                </button>
            </div>

            {/* Main Content Grid */}
            <div className={styles.contentGrid}>

                {/* Left Column: Details */}
                <div className={styles.mainContent}>

                    {/* Host Info - Old Simple Removed */}


                    {/* Highlights */}
                    <div className={styles.highlights}>
                        <div className={styles.highlightItem}>
                            <div className={styles.highlightIcon}><Award size={24} /></div>
                            <div className={styles.highlightText}>
                                <h3>Guest favorite</h3>
                                <p>One of the most loved homes on Vihara based on ratings, reviews, and reliability.</p>
                            </div>
                        </div>
                        <div className={styles.highlightItem}>
                            <div className={styles.highlightIcon}><ShieldCheck size={24} /></div>
                            <div className={styles.highlightText}>
                                <h3>Self check-in</h3>
                                <p>Check yourself in with the keypad.</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className={styles.description}>
                        <p>{hotel.description}</p>
                    </div>

                    {/* Amenities */}
                    <div className={styles.amenitiesSection}>
                        <h2 className={styles.amenitiesTitle}>What this place offers</h2>
                        <div className={styles.amenitiesList}>
                            {/* Fixed Icons for Demo + Dynamic Custom Amenities */}
                            <div className={styles.amenityItem}><Wifi size={20} /> Wifi</div>
                            <div className={styles.amenityItem}><Coffee size={20} /> Kitchen</div>
                            <div className={styles.amenityItem}><Utensils size={20} /> Dining</div>
                            {amenitiesList.map((amenity, i) => (
                                <div key={i} className={styles.amenityItem}>
                                    <Star size={20} /> {amenity}
                                </div>
                            ))}
                        </div>
                        <button className={styles.showAllBtn}>Show all {3 + amenitiesList.length} amenities</button>
                    </div>

                    {/* Map */}
                    <div className={styles.mapSection}>
                        <h2 className={styles.amenitiesTitle}>Where you'll be</h2>
                        <div className={styles.mapContainer}>
                            {/* Reuse MapComponent but focused on one hotel */}
                            <MapWrapper hotels={[serializedHotel]} />
                        </div>
                        <p className={styles.locationText}>{hotel.location}</p>
                        <p className={styles.descriptionText}>{hotel.shortDescription}</p>
                    </div>

                    {/* Meet Your Host Section */}
                    <div className={styles.hostSectionContainer}>
                        <h2 className={styles.hostTitle}>Meet your host</h2>
                        <div className={styles.hostLayout}>
                            {/* Left Card */}
                            <div className={styles.hostCard}>
                                <div className={styles.hostCardFlex}>
                                    <div className={styles.flex1}>
                                        <div className={styles.hostAvatarLarge}>
                                            {/* DiceBear Avatar */}
                                            <div className={styles.relativeFull}>
                                                <Image
                                                    src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${host ? host.username : "Host"}&backgroundColor=b6e3f4,c0aede,d1d4f9&clothing=${host?.gender === 'female' ? 'collarAndSweater' : 'shirtCrewNeck'}&top=${host?.gender === 'female' ? 'longButNotTooLong,straight01,straight02' : 'shortFlat,shortRound,theCaesar'}&accessoriesProbability=0`}
                                                    alt="Host"
                                                    fill
                                                    className={styles.coverImage}
                                                />
                                            </div>
                                            <div className={styles.badge}>✔</div>
                                        </div>
                                        <div className={styles.hostCardName}>{host ? host.username : "Host"}</div>
                                        <div className={styles.hostLabel}>Host</div>
                                    </div>
                                    <div className={styles.textAlignLeft}>
                                        <div className={styles.statValue}>9</div>
                                        <div className={styles.statLabelSmall}>Reviews</div>
                                        <div className={styles.divider}></div>
                                        <div className={styles.statValue}>5.0★</div>
                                        <div className={styles.statLabelSmall}>Rating</div>
                                        <div className={styles.divider}></div>
                                        <div className={styles.statValue}>1</div>
                                        <div className={styles.statLabelSmall}>Year hosting</div>
                                    </div>
                                </div>
                                <div className={`${styles.hostDetailsRight} ${styles.paddingTop0}`}>
                                    {/* Additional details inside card if needed */}
                                </div>
                            </div>

                            {/* Right Details */}
                            <div className={styles.hostDetailsRight}>
                                <h3 className={styles.hostDetailTitle}>Host details</h3>
                                <div className={styles.hostMetaList}>
                                    <div className={styles.hostMetaItem}>Response rate: 100%</div>
                                    <div className={styles.hostMetaItem}>Responds within an hour</div>
                                </div>
                                <button className={styles.messageBtn}>Message host</button>
                                <div className={styles.safetyDisclaimer}>
                                    <ShieldCheck size={24} className={styles.shieldIcon} />
                                    <span>To help protect your payment, always use Vihara to send money and communicate with hosts.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Things to know */}
                    <ThingsToKnow hotel={serializedHotel} />

                </div>

                {/* Right Column: Sticky Sidebar */}
                <div className={styles.sidebar}>
                    <BookingSidebar hotel={serializedHotel} />
                </div>

            </div>
        </div>
    );
}
