'use client';

import { useEffect, useState } from "react";
import HostSidebar from "@/app/components/HostSidebar";
import styles from "./addHotel.module.css";
import { Upload, X, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { createHotelAction } from "@/app/serverActions/hotelActions";



const PREDEFINED_AMENITIES = ['Wifi', 'Pool', 'AC', 'Parking', 'Kitchen', 'TV', 'Gym', 'Spa'];

export default function AddHotel() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [allowedLocations, setAllowedLocations] = useState([]);

  // Form State
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const [formDataState, setFormDataState] = useState({
    name: "",
    location: "",
    description: "",
    shortDescription: "",
    category: "",
    price: "",
    lat: "",
    lng: "",
    checkInTime: "14:00",
    checkOutTime: "11:00",
    facilities: {
      guests: 4,
      bedrooms: 2,
      bathrooms: 1,
      beds: 2
    },
    amenities: [],
    houseRules: []
  });

  const [customAmenityInput, setCustomAmenityInput] = useState("");
  const [customHouseRuleInput, setCustomHouseRuleInput] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("/api/host/allowed-locations");
        const data = await res.json();
        if (data.success) {
          setAllowedLocations(data.locations);
        }
      } catch (error) {
        console.error("Failed to load locations", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

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
      setGallery([...gallery, ...files]);
      const newPreviews = files.map(f => URL.createObjectURL(f));
      setGalleryPreviews([...galleryPreviews, ...newPreviews]);
    }
  };

  const removeGalleryImage = (index) => {
    const newGallery = [...gallery];
    newGallery.splice(index, 1);
    setGallery(newGallery);

    const newPreviews = [...galleryPreviews];
    newPreviews.splice(index, 1);
    setGalleryPreviews(newPreviews);
  };

  async function handleAction(formData) {
    if (!formDataState.location) {
      alert("Please select a location");
      return;
    }

    setSubmitting(true);

    // Manually append complex data and files not handled by inputs directly
    formData.append('amenities', JSON.stringify(formDataState.amenities));
    formData.append('facilities', JSON.stringify(formDataState.facilities));
    formData.append('houseRules', JSON.stringify(formDataState.houseRules));
    formData.append('lat', formDataState.lat);
    formData.append('lng', formDataState.lng);

    if (image) {
      formData.append("image", image);
    }

    gallery.forEach(file => {
      formData.append("gallery", file);
    });

    try {
      const result = await createHotelAction(formData);

      if (result.success) {
        alert("Success! Your property has been submitted for approval.");
        router.push('/host/my-hotels');
      } else {
        alert(result.message || "Failed to add hotel");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.container}>
      <HostSidebar />
      <div className={styles.main}>
        <div className={styles.formCard}>
          <div className={styles.header}>
            <h1 className={styles.title}>List a New Property</h1>
            <p className={styles.subtitle}>Fill in the details below to add your hotel, resort, or stay to Vihara.</p>
          </div>

          <form action={handleAction}>
            {/* Image Upload */}
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
                        setImage(null);
                        setImagePreview(null);
                      }}
                      className={styles.imagePreviewRemoveBtn}
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload size={40} className={styles.uploadIcon} />
                    <p className={styles.uploadIconText}>Click to upload cover image</p>
                    <p className={styles.uploadIconSubtext}>SVG, PNG, JPG or GIF (max. 5MB)</p>
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
                <input
                  className={styles.input}
                  name="name"
                  placeholder="e.g. Vihara Resort & Spa"
                  required
                  value={formDataState.name}
                  onChange={(e) => setFormDataState({ ...formDataState, name: e.target.value })}
                />
              </div>
              <div>
                <label className={styles.label}>Category</label>
                <select
                  className={styles.select}
                  name="category"
                  required
                  value={formDataState.category}
                  onChange={(e) => setFormDataState({ ...formDataState, category: e.target.value })}
                >
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
                <select
                  className={styles.select}
                  name="location"
                  required
                  value={formDataState.location}
                  onChange={(e) => setFormDataState({ ...formDataState, location: e.target.value })}
                  disabled={loading}
                >
                  <option value="">{loading ? "Loading locations..." : "Select Location"}</option>
                  {allowedLocations.map((loc) => (
                    <option key={loc._id} value={loc.location}>
                      {loc.location}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={styles.label}>Price per Night (₹)</label>
                <input
                  className={styles.input}
                  name="price"
                  placeholder="0.00"
                  type="number"
                  required
                  value={formDataState.price}
                  onChange={(e) => setFormDataState({ ...formDataState, price: e.target.value })}
                />
              </div>
            </div>

            {/* Exact Location Manual Inputs */}
            <div className={styles.grid}>
              <div>
                <label className={styles.label}>Latitude</label>
                <input
                  className={styles.input}
                  name="lat"
                  placeholder="e.g. 9.9312"
                  type="number"
                  step="any"
                  required
                  value={formDataState.lat}
                  onChange={(e) => setFormDataState({ ...formDataState, lat: e.target.value })}
                />
              </div>
              <div>
                <label className={styles.label}>Longitude</label>
                <input
                  className={styles.input}
                  name="lng"
                  placeholder="e.g. 76.2673"
                  type="number"
                  step="any"
                  required
                  value={formDataState.lng}
                  onChange={(e) => setFormDataState({ ...formDataState, lng: e.target.value })}
                />
              </div>
            </div>
            <p className={styles.coordinateInfo}>
              * Right-click on Google Maps to get these coordinates. This ensures your hotel appears correctly on the map.
            </p>

            <div className={styles.marginBottom24}>
              <label className={styles.label}>Short Description (for card view)</label>
              <input
                className={styles.input}
                name="shortDescription"
                placeholder="A brief summary (e.g. 'Luxury villa with private pool')"
                value={formDataState.shortDescription}
                onChange={(e) => setFormDataState({ ...formDataState, shortDescription: e.target.value })}
                maxLength={150}
              />
            </div>

            <div className={styles.marginBottom24}>
              <label className={styles.label}>Description (Full Details)</label>
              <textarea
                className={styles.textarea}
                name="description"
                placeholder="Describe your property, amenities, and what makes it special..."
                required
                value={formDataState.description}
                onChange={(e) => setFormDataState({ ...formDataState, description: e.target.value })}
              />
            </div>

            {/* Gallery Upload */}
            <div className={styles.marginBottom32}>
              <label className={styles.label}>Gallery Images</label>
              <div
                className={`${styles.fileUpload} ${styles.galleryUploadContainer}`}
                onClick={() => document.getElementById('galleryInput').click()}
              >
                <Upload size={30} className={styles.uploadIcon} />
                <p className={styles.uploadIconText}>Upload additional photos</p>
                <p className={styles.uploadIconSubtext}>Select multiple files (max 10)</p>
                <input
                  id="galleryInput"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGalleryChange}
                  className={styles.hiddenInput}
                />
              </div>
              {galleryPreviews.length > 0 && (
                <div className={styles.galleryPreviewsContainer}>
                  {galleryPreviews.map((src, i) => (
                    <div key={i} className={styles.galleryPreviewItem}>
                      <img src={src} className={styles.galleryPreviewImg} alt={`Gallery ${i}`} />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(i)}
                        className={styles.galleryPreviewRemoveBtn}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Room Details / Facilities */}
            <div className={styles.grid}>
              <div>
                <label className={styles.label}>Guests</label>
                <input
                  type="number"
                  className={styles.input}
                  value={formDataState.facilities.guests}
                  onChange={(e) => setFormDataState({
                    ...formDataState,
                    facilities: { ...formDataState.facilities, guests: parseInt(e.target.value) || 0 }
                  })}
                  min="1"
                />
              </div>
              <div>
                <label className={styles.label}>Bedrooms</label>
                <input
                  type="number"
                  className={styles.input}
                  value={formDataState.facilities.bedrooms}
                  onChange={(e) => setFormDataState({
                    ...formDataState,
                    facilities: { ...formDataState.facilities, bedrooms: parseInt(e.target.value) || 0 }
                  })}
                  min="1"
                />
              </div>
              <div>
                <label className={styles.label}>Beds</label>
                <input
                  type="number"
                  className={styles.input}
                  value={formDataState.facilities.beds}
                  onChange={(e) => setFormDataState({
                    ...formDataState,
                    facilities: { ...formDataState.facilities, beds: parseInt(e.target.value) || 0 }
                  })}
                  min="1"
                />
              </div>
              <div>
                <label className={styles.label}>Bathrooms</label>
                <input
                  type="number"
                  className={styles.input}
                  value={formDataState.facilities.bathrooms}
                  onChange={(e) => setFormDataState({
                    ...formDataState,
                    facilities: { ...formDataState.facilities, bathrooms: parseInt(e.target.value) || 0 }
                  })}
                  min="1"
                />
              </div>
            </div>

            {/* Custom Amenities */}
            {/* Custom Amenities */}
            <div className={styles.marginTop24}>
              <label className={styles.label}>Amenities</label>

              {/* Predefined Chips */}
              <div className={styles.amenitiesContainer}>
                {PREDEFINED_AMENITIES.map(opt => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => {
                      const newAmenities = formDataState.amenities.includes(opt)
                        ? formDataState.amenities.filter(a => a !== opt)
                        : [...formDataState.amenities, opt];
                      setFormDataState({ ...formDataState, amenities: newAmenities });
                    }}
                    className={`${styles.amenityChip} ${formDataState.amenities.includes(opt) ? styles.amenityChipActive : styles.amenityChipInactive}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className={styles.customInputWrapper}>
                <input
                  className={styles.input}
                  placeholder="Add custom amenity..."
                  value={customAmenityInput}
                  onChange={(e) => setCustomAmenityInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = customAmenityInput.trim();
                      if (val && !formDataState.amenities.includes(val)) {
                        setFormDataState({ ...formDataState, amenities: [...formDataState.amenities, val] });
                        setCustomAmenityInput("");
                      }
                    }
                  }}
                />
                <button type="button" className={`${styles.submitBtn} ${styles.customAddBtn}`} onClick={() => {
                  const val = customAmenityInput.trim();
                  if (val && !formDataState.amenities.includes(val)) {
                    setFormDataState({ ...formDataState, amenities: [...formDataState.amenities, val] });
                    setCustomAmenityInput("");
                  }
                }}>Add</button>
              </div>

              {/* Display Custom Added Amenities */}
              <div className={styles.addedTagsContainer}>
                {formDataState.amenities
                  .filter(a => !PREDEFINED_AMENITIES.includes(a))
                  .map((amenity, index) => (
                    <span key={index} className={styles.addedTagChip}>
                      {amenity}
                      <button type="button" onClick={() => {
                        setFormDataState({ ...formDataState, amenities: formDataState.amenities.filter(a => a !== amenity) });
                      }} className={styles.removeTagBtn}>
                        <X size={14} />
                      </button>
                    </span>
                  ))}
              </div>
            </div>

            {/* Policies Section */}
            <div className={styles.policiesSection}>
              <h3 className={styles.policiesTitle}>Property Policies</h3>

              <div className={styles.grid}>
                <div>
                  <label className={styles.label}>Check-in Time</label>
                  <input
                    type="time"
                    name="checkInTime"
                    className={styles.input}
                    value={formDataState.checkInTime}
                    onChange={(e) => setFormDataState({ ...formDataState, checkInTime: e.target.value })}
                  />
                </div>
                <div>
                  <label className={styles.label}>Check-out Time</label>
                  <input
                    type="time"
                    name="checkOutTime"
                    className={styles.input}
                    value={formDataState.checkOutTime}
                    onChange={(e) => setFormDataState({ ...formDataState, checkOutTime: e.target.value })}
                  />
                </div>
              </div>

              {/* House Rules */}
              <div className={styles.houseRulesContainer}>
                <label className={styles.label}>House Rules</label>
                <div className={styles.customInputWrapper}>
                  <input
                    className={styles.input}
                    placeholder="Add a rule (e.g. No smoking)"
                    value={customHouseRuleInput}
                    onChange={(e) => setCustomHouseRuleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = customHouseRuleInput.trim();
                        if (val && !formDataState.houseRules.includes(val)) {
                          setFormDataState({ ...formDataState, houseRules: [...formDataState.houseRules, val] });
                          setCustomHouseRuleInput("");
                        }
                      }
                    }}
                  />
                  <button type="button" className={`${styles.submitBtn} ${styles.customAddBtn}`} onClick={() => {
                    const val = customHouseRuleInput.trim();
                    if (val && !formDataState.houseRules.includes(val)) {
                      setFormDataState({ ...formDataState, houseRules: [...formDataState.houseRules, val] });
                      setCustomHouseRuleInput("");
                    }
                  }}>Add</button>
                </div>

                {formDataState.houseRules.length > 0 && (
                  <div className={styles.addedTagsContainer}>
                    {formDataState.houseRules.map((rule, index) => (
                      <span key={index} className={styles.addedTagChip}>
                        {rule}
                        <button type="button" onClick={() => {
                          setFormDataState({ ...formDataState, houseRules: formDataState.houseRules.filter(r => r !== rule) });
                        }} className={styles.removeTagBtn}>
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => router.back()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Property'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}