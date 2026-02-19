'use client';

import { useEffect, useState, use } from "react";
import HostSidebar from "@/app/components/HostSidebar";
import styles from "./editHotel.module.css";
import { Upload, X, Plus } from "lucide-react";
import { updateHotelAction } from "@/app/serverActions/hotelActions";
import { useRouter } from "next/navigation";

export default function EditHotel({ params }) {
    // Ungroup params using React.use() or await if async, but this is a client component
    // In Next.js 15, params is a promise even in client components if passed from layout?
    // Actually, in default Client Components it's prop. 
    // Let's assume standard Next.js behavior. If it fails we fix.
    // Safe way: `const { id } = use(params);` if React 19/Next 15, or just `params.id` if older.
    // Given the context `export default async function HotelDetailPage({ params })` in another file used `await params`, 
    // it suggests we might need to handle it as a promise.
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [allowedLocations, setAllowedLocations] = useState([]);

    // Form State
    const [image, setImage] = useState(null); // New image file
    const [imagePreview, setImagePreview] = useState(null); // Preview URL (new or existing)

    // Existing Gallery (URLs) vs New Gallery (Files)
    const [existingGallery, setExistingGallery] = useState([]);
    const [newGalleryFiles, setNewGalleryFiles] = useState([]);
    const [newGalleryPreviews, setNewGalleryPreviews] = useState([]);

    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");

    const [facilities, setFacilities] = useState({
        guests: 4,
        bedrooms: 2,
        bathrooms: 1,
        beds: 2
    });
    const [amenities, setAmenities] = useState([]);

    // Policies State
    const [checkInTime, setCheckInTime] = useState("14:00");
    const [checkOutTime, setCheckOutTime] = useState("11:00");
    const [houseRules, setHouseRules] = useState([]);


    const [customAmenityInput, setCustomAmenityInput] = useState("");
    const [customHouseRuleInput, setCustomHouseRuleInput] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Locations
                const locRes = await fetch("/api/host/allowed-locations");
                const locData = await locRes.json();
                if (locData.success) {
                    setAllowedLocations(locData.locations);
                }

                // 2. Fetch Hotel Details
                const hotelRes = await fetch(`/api/host/edit-hotel/${id}`);
                const hotelData = await hotelRes.json();

                if (hotelData.success) {
                    const h = hotelData.hotel;
                    setName(h.name);
                    setLocation(h.location);
                    setDescription(h.description);
                    setShortDescription(h.shortDescription || "");
                    setCategory(h.category);
                    setPrice(h.price);
                    setLat(h.lat || "");
                    setLng(h.lng || "");
                    setFacilities(h.facilities || { guests: 4, bedrooms: 2, bathrooms: 1, beds: 2 });
                    setAmenities(h.amenities || []);
                    setImagePreview(h.image); // Display existing image
                    setExistingGallery(h.images || []);
                    setCheckInTime(h.checkInTime || "14:00");
                    setCheckOutTime(h.checkOutTime || "11:00");
                    setHouseRules(h.houseRules || []);
                } else {
                    alert("Failed to fetch hotel details: " + hotelData.message);
                }
            } catch (error) {
                console.error("Error loading data", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setNewGalleryFiles([...newGalleryFiles, ...files]);
            const newPreviews = files.map(f => URL.createObjectURL(f));
            setNewGalleryPreviews([...newGalleryPreviews, ...newPreviews]);
        }
    }

    const removeNewGalleryImage = (index) => {
        const newFiles = [...newGalleryFiles];
        newFiles.splice(index, 1);
        setNewGalleryFiles(newFiles);

        const newPreviews = [...newGalleryPreviews];
        newPreviews.splice(index, 1);
        setNewGalleryPreviews(newPreviews);
    }

    const removeExistingGalleryImage = (index) => {
        const newExisting = [...existingGallery];
        newExisting.splice(index, 1);
        setExistingGallery(newExisting);
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        if (image) data.append("image", image); // Only append if new image selected

        newGalleryFiles.forEach(file => data.append("gallery", file)); // Append new gallery files

        data.append("existingImages", JSON.stringify(existingGallery)); // Send remaining existing images

        data.append("name", name);
        data.append("location", location);
        data.append("description", description);
        data.append("shortDescription", shortDescription);
        data.append("category", category);
        data.append("price", price);
        data.append("lat", lat);
        data.append("lng", lng);
        data.append("amenities", JSON.stringify(amenities));
        data.append("facilities", JSON.stringify(facilities));
        data.append("checkInTime", checkInTime);
        data.append("checkOutTime", checkOutTime);
        data.append("houseRules", JSON.stringify(houseRules));
        data.append("hotelId", id);

        try {
            const result = await updateHotelAction(data);

            if (result.success) {
                alert("Hotel updated successfully!");
                router.push('/host/my-hotels');
            } else {
                alert(result.message || "Failed to update hotel");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className={styles.container}><p style={{ padding: 40 }}>Loading...</p></div>;

    return (
        <div className={styles.container}>
            <HostSidebar />
            <div className={styles.main}>
                <div className={styles.formCard}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Edit Property</h1>
                        <p className={styles.subtitle}>Update details for {name}</p>
                    </div>

                    <form onSubmit={submitHandler}>
                        {/* Image Upload */}
                        <div style={{ marginBottom: '32px' }}>
                            <label className={styles.label}>Property Image</label>
                            <div
                                className={styles.fileUpload}
                                onClick={() => document.getElementById('fileInput').click()}
                                style={imagePreview ? { padding: 0, overflow: 'hidden', border: 'none' } : {}}
                            >
                                {imagePreview ? (
                                    <div style={{ position: 'relative', height: '300px' }}>
                                        <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // If it's a new file, clear it. If it's existing, we can't really 'clear' main image legally without replacing.
                                                // So let's just allow replacing.
                                                document.getElementById('fileInput').click();
                                            }}
                                            style={{
                                                position: 'absolute', bottom: 10, right: 10,
                                                background: 'white', border: 'none',
                                                borderRadius: '20px', padding: '8px 16px', cursor: 'pointer',
                                                fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                            }}
                                        >
                                            Change Image
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <Upload size={40} className={styles.uploadIcon} />
                                        <p style={{ fontWeight: 600 }}>Click to upload cover image</p>
                                    </div>
                                )}
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>

                        <div className={styles.grid}>
                            <div>
                                <label className={styles.label}>Property Name</label>
                                <input className={styles.input} required value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div>
                                <label className={styles.label}>Category</label>
                                <select className={styles.select} required value={category} onChange={(e) => setCategory(e.target.value)}>
                                    <option value="">Select Category</option>
                                    <option value="Resort">Resort</option>
                                    <option value="Hotel">Hotel</option>
                                    <option value="Villa">Villa</option>
                                    <option value="Cottage">Cottage</option>
                                    <option value="Homestay">Homestay</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.grid}>
                            <div>
                                <label className={styles.label}>Location</label>
                                <select className={styles.select} required value={location} onChange={(e) => setLocation(e.target.value)}>
                                    {allowedLocations.map((loc) => (
                                        <option key={loc._id} value={loc.location}>{loc.location}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={styles.label}>Price per Night (₹)</label>
                                <input className={styles.input} type="number" required value={price} onChange={(e) => setPrice(e.target.value)} />
                            </div>
                        </div>

                        {/* Lat/Lng */}
                        <div className={styles.grid}>
                            <div>
                                <label className={styles.label}>Latitude</label>
                                <input className={styles.input} type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} />
                            </div>
                            <div>
                                <label className={styles.label}>Longitude</label>
                                <input className={styles.input} type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label className={styles.label}>Short Description</label>
                            <input className={styles.input} value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label className={styles.label}>Description</label>
                            <textarea className={styles.textarea} required value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>

                        {/* Gallery */}
                        <div style={{ marginBottom: '32px' }}>
                            <label className={styles.label}>Gallery Images</label>

                            {/* Existing Images */}
                            {existingGallery.length > 0 && (
                                <div style={{ marginBottom: 10 }}>
                                    <p style={{ fontSize: '0.9rem', marginBottom: 5 }}>Current Images:</p>
                                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                                        {existingGallery.map((src, i) => (
                                            <div key={i} style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
                                                <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                                <button type="button" onClick={() => removeExistingGalleryImage(i)} style={{ position: 'absolute', top: 0, right: 0, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>×</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className={styles.fileUpload} onClick={() => document.getElementById('galleryInput').click()} style={{ padding: '1rem', borderStyle: 'dashed' }}>
                                <Upload size={24} className={styles.uploadIcon} />
                                <p style={{ fontWeight: 600 }}>Add more photos</p>
                                <input id="galleryInput" type="file" multiple accept="image/*" onChange={handleGalleryChange} style={{ display: 'none' }} />
                            </div>

                            {newGalleryFiles.length > 0 && (
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', overflowX: 'auto' }}>
                                    {newGalleryPreviews.map((src, i) => (
                                        <div key={i} style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
                                            <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                            <button type="button" onClick={() => removeNewGalleryImage(i)} style={{ position: 'absolute', top: 0, right: 0, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>×</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Custom Amenities */}
                        <div style={{ marginBottom: '24px' }}>
                            <label className={styles.label}>Amenities</label>

                            {/* Predefined Chips */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                                {['Wifi', 'Pool', 'AC', 'Parking', 'Kitchen', 'TV', 'Gym', 'Spa'].map(opt => (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() => {
                                            if (amenities.includes(opt)) {
                                                setAmenities(amenities.filter(a => a !== opt));
                                            } else {
                                                setAmenities([...amenities, opt]);
                                            }
                                        }}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            border: '1px solid #ddd',
                                            background: amenities.includes(opt) ? '#000' : 'white',
                                            color: amenities.includes(opt) ? 'white' : '#333',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {amenities.includes(opt) ? <X size={14} /> : <Plus size={14} />}
                                        {opt}
                                    </button>
                                ))}
                            </div>

                            <label className={styles.label} style={{ fontSize: '0.9rem', color: '#666' }}>Add Custom Amenity</label>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                                <input className={styles.input} placeholder="Add amenity" value={customAmenityInput} onChange={(e) => setCustomAmenityInput(e.target.value)} onKeyDown={(e) => {
                                    if (e.key === 'Enter') { e.preventDefault(); if (customAmenityInput.trim()) { setAmenities([...amenities, customAmenityInput.trim()]); setCustomAmenityInput(""); } }
                                }} />
                                <button type="button" className={styles.submitBtn} style={{ width: 'auto', padding: '0 20px' }} onClick={() => { if (customAmenityInput.trim()) { setAmenities([...amenities, customAmenityInput.trim()]); setCustomAmenityInput(""); } }}>Add</button>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {amenities.filter(item => !['Wifi', 'Pool', 'AC', 'Parking', 'Kitchen', 'TV', 'Gym', 'Spa'].includes(item)).map((item, index) => (
                                    <span key={index} style={{ background: '#e0e0e0', padding: '6px 12px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {item}
                                        <X size={14} style={{ cursor: 'pointer' }} onClick={() => setAmenities(amenities.filter((_, i) => i !== index))} />
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Policies */}
                        <div style={{ marginBottom: '32px', borderTop: '1px solid #eee', paddingTop: '24px' }}>
                            <h3 className={styles.label}>Property Policies</h3>
                            <div className={styles.grid}>
                                <div><label className={styles.label}>Check-in Time</label><input type="time" className={styles.input} value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} /></div>
                                <div><label className={styles.label}>Check-out Time</label><input type="time" className={styles.input} value={checkOutTime} onChange={(e) => setCheckOutTime(e.target.value)} /></div>
                            </div>

                            <label className={styles.label}>House Rules</label>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                                <input className={styles.input} placeholder="Add rule" value={customHouseRuleInput} onChange={(e) => setCustomHouseRuleInput(e.target.value)} onKeyDown={(e) => {
                                    if (e.key === 'Enter') { e.preventDefault(); if (customHouseRuleInput.trim()) { setHouseRules([...houseRules, customHouseRuleInput.trim()]); setCustomHouseRuleInput(""); } }
                                }} />
                                <button type="button" className={styles.submitBtn} style={{ width: 'auto', padding: '0 20px' }} onClick={() => { if (customHouseRuleInput.trim()) { setHouseRules([...houseRules, customHouseRuleInput.trim()]); setCustomHouseRuleInput(""); } }}>Add</button>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {houseRules.map((item, index) => (
                                    <span key={index} style={{ background: '#fff3e0', border: '1px solid #ffcc80', padding: '6px 12px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {item}
                                        <X size={14} style={{ cursor: 'pointer' }} onClick={() => setHouseRules(houseRules.filter((_, i) => i !== index))} />
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Room Details Form */}
                        <div className={styles.grid}>
                            <div>
                                <label className={styles.label}>Guests</label>
                                <input className={styles.input} type="number" value={facilities.guests} onChange={(e) => setFacilities({ ...facilities, guests: e.target.value })} />
                            </div>
                            <div>
                                <label className={styles.label}>Bedrooms</label>
                                <input className={styles.input} type="number" value={facilities.bedrooms} onChange={(e) => setFacilities({ ...facilities, bedrooms: e.target.value })} />
                            </div>
                            <div>
                                <label className={styles.label}>Beds</label>
                                <input className={styles.input} type="number" value={facilities.beds} onChange={(e) => setFacilities({ ...facilities, beds: e.target.value })} />
                            </div>
                            <div>
                                <label className={styles.label}>Bathrooms</label>
                                <input className={styles.input} type="number" value={facilities.bathrooms} onChange={(e) => setFacilities({ ...facilities, bathrooms: e.target.value })} />
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <a href="/host/my-hotels" className={styles.cancelBtn}>Cancel</a>
                            <button type="submit" className={styles.submitBtn} disabled={submitting}>
                                {submitting ? 'Updating...' : 'Update Property'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
