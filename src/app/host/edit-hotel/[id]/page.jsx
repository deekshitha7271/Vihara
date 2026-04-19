'use client';

import { useEffect, useState, use } from "react";
import HostSidebar from "@/app/components/HostSidebar";
import styles from "./editHotel.module.css";
import { Upload, X, Plus } from "lucide-react";
import { updateHotelAction } from "@/app/serverActions/hotelActions";
import { useRouter } from "next/navigation";

export default function EditHotel({ params }) {
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

    if (loading) return <div className={styles.container}><p className={styles.loadingContainer}>Loading...</p></div>;

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
                        <div className={styles.marginBottom32}>
                            <label className={styles.label}>Property Image</label>
                            <div
                                className={`${styles.fileUpload} ${imagePreview ? styles.imagePreviewWrapper : ''}`}
                                onClick={() => document.getElementById('fileInput').click()}
                            >
                                {imagePreview ? (
                                    <div className={styles.imagePreviewWrapper}>
                                        <img src={imagePreview} alt="Preview" className={styles.imagePreviewImg} />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // If it's a new file, clear it. If it's existing, we can't really 'clear' main image legally without replacing.
                                                // So let's just allow replacing.
                                                document.getElementById('fileInput').click();
                                            }}
                                            className={styles.imagePreviewChangeBtn}
                                        >
                                            Change Image
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <Upload size={40} className={styles.uploadIcon} />
                                        <p className={styles.uploadIconText}>Click to upload cover image</p>
                                    </div>
                                )}
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className={styles.hiddenInput}
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

                        <div className={styles.marginBottom24}>
                            <label className={styles.label}>Short Description</label>
                            <input className={styles.input} value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
                        </div>

                        <div className={styles.marginBottom24}>
                            <label className={styles.label}>Description</label>
                            <textarea className={styles.textarea} required value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>

                        <div className={styles.marginBottom32}>
                            <label className={styles.label}>Gallery Images</label>

                            {/* Existing Images */}
                            {existingGallery.length > 0 && (
                                <div className={styles.marginBottom10}>
                                    <p className={styles.galleryTextLabel}>Current Images:</p>
                                    <div className={styles.galleryPreviewsContainer}>
                                        {existingGallery.map((src, i) => (
                                            <div key={i} className={styles.galleryPreviewItem}>
                                                <img src={src} className={styles.galleryPreviewImg} />
                                                <button type="button" onClick={() => removeExistingGalleryImage(i)} className={styles.galleryPreviewRemoveBtn}>×</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className={`${styles.fileUpload} ${styles.galleryUploadContainer}`} onClick={() => document.getElementById('galleryInput').click()}>
                                <Upload size={24} className={styles.uploadIcon} />
                                <p className={styles.uploadIconText}>Add more photos</p>
                                <input id="galleryInput" type="file" multiple accept="image/*" onChange={handleGalleryChange} className={styles.hiddenInput} />
                            </div>

                            {newGalleryFiles.length > 0 && (
                                <div className={styles.galleryPreviewsContainer}>
                                    {newGalleryPreviews.map((src, i) => (
                                        <div key={i} className={styles.galleryPreviewItem}>
                                            <img src={src} className={styles.galleryPreviewImg} />
                                            <button type="button" onClick={() => removeNewGalleryImage(i)} className={styles.galleryPreviewRemoveBtn}>×</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className={styles.marginBottom24}>
                            <label className={styles.label}>Amenities</label>

                            <div className={styles.amenitiesContainer}>
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
                                        className={`${styles.amenityChip} ${amenities.includes(opt) ? styles.amenityChipActive : styles.amenityChipInactive}`}
                                    >
                                        {amenities.includes(opt) ? <X size={14} /> : <Plus size={14} />}
                                        {opt}
                                    </button>
                                ))}
                            </div>

                            <label className={`${styles.label} ${styles.customAmenityLabel}`}>Add Custom Amenity</label>
                            <div className={styles.customInputWrapper}>
                                <input className={styles.input} placeholder="Add amenity" value={customAmenityInput} onChange={(e) => setCustomAmenityInput(e.target.value)} onKeyDown={(e) => {
                                    if (e.key === 'Enter') { e.preventDefault(); if (customAmenityInput.trim()) { setAmenities([...amenities, customAmenityInput.trim()]); setCustomAmenityInput(""); } }
                                }} />
                                <button type="button" className={`${styles.submitBtn} ${styles.customAddBtn}`} onClick={() => { if (customAmenityInput.trim()) { setAmenities([...amenities, customAmenityInput.trim()]); setCustomAmenityInput(""); } }}>Add</button>
                            </div>
                            <div className={styles.addedTagsContainer}>
                                {amenities.filter(item => !['Wifi', 'Pool', 'AC', 'Parking', 'Kitchen', 'TV', 'Gym', 'Spa'].includes(item)).map((item, index) => (
                                    <span key={index} className={styles.addedTagChipEdit}>
                                        {item}
                                        <X size={14} className={styles.removeTagBtn} onClick={() => setAmenities(amenities.filter((_, i) => i !== index))} />
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className={styles.policiesSection}>
                            <h3 className={styles.label}>Property Policies</h3>
                            <div className={styles.grid}>
                                <div><label className={styles.label}>Check-in Time</label><input type="time" className={styles.input} value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} /></div>
                                <div><label className={styles.label}>Check-out Time</label><input type="time" className={styles.input} value={checkOutTime} onChange={(e) => setCheckOutTime(e.target.value)} /></div>
                            </div>

                            <label className={styles.label}>House Rules</label>
                            <div className={styles.customInputWrapper}>
                                <input className={styles.input} placeholder="Add rule" value={customHouseRuleInput} onChange={(e) => setCustomHouseRuleInput(e.target.value)} onKeyDown={(e) => {
                                    if (e.key === 'Enter') { e.preventDefault(); if (customHouseRuleInput.trim()) { setHouseRules([...houseRules, customHouseRuleInput.trim()]); setCustomHouseRuleInput(""); } }
                                }} />
                                <button type="button" className={`${styles.submitBtn} ${styles.customAddBtn}`} onClick={() => { if (customHouseRuleInput.trim()) { setHouseRules([...houseRules, customHouseRuleInput.trim()]); setCustomHouseRuleInput(""); } }}>Add</button>
                            </div>
                            <div className={styles.addedTagsContainer}>
                                {houseRules.map((item, index) => (
                                    <span key={index} className={styles.addedTagChipRule}>
                                        {item}
                                        <X size={14} className={styles.removeTagBtn} onClick={() => setHouseRules(houseRules.filter((_, i) => i !== index))} />
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
