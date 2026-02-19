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
                        setImage(null);
                        setImagePreview(null);
                      }}
                      style={{
                        position: 'absolute', top: 10, right: 10,
                        background: 'white', border: 'none',
                        borderRadius: '50%', padding: '8px', cursor: 'pointer'
                      }}
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload size={40} className={styles.uploadIcon} />
                    <p style={{ fontWeight: 600 }}>Click to upload cover image</p>
                    <p style={{ fontSize: '0.9rem', color: '#888' }}>SVG, PNG, JPG or GIF (max. 5MB)</p>
                  </div>
                )}
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                // Not strictly required if handled via state logic for formData append
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
            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '-12px', marginBottom: '24px' }}>
              * Right-click on Google Maps to get these coordinates. This ensures your hotel appears correctly on the map.
            </p>

            <div style={{ marginBottom: '24px' }}>
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

            <div style={{ marginBottom: '24px' }}>
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
            <div style={{ marginBottom: '32px' }}>
              <label className={styles.label}>Gallery Images</label>
              <div
                className={styles.fileUpload}
                onClick={() => document.getElementById('galleryInput').click()}
                style={{ padding: '2rem', borderStyle: 'dashed' }}
              >
                <Upload size={30} className={styles.uploadIcon} />
                <p style={{ fontWeight: 600 }}>Upload additional photos</p>
                <p style={{ fontSize: '0.9rem', color: '#888' }}>Select multiple files (max 10)</p>
                <input
                  id="galleryInput"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGalleryChange}
                  style={{ display: 'none' }}
                />
              </div>
              {galleryPreviews.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', overflowX: 'auto' }}>
                  {galleryPreviews.map((src, i) => (
                    <div key={i} style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
                      <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} alt={`Gallery ${i}`} />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(i)}
                        style={{ position: 'absolute', top: 0, right: 0, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
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
            <div style={{ marginBottom: '24px', marginTop: '24px' }}>
              <label className={styles.label}>Amenities</label>

              {/* Predefined Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
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
                    style={{
                      background: formDataState.amenities.includes(opt) ? '#333' : '#f0f0f0',
                      color: formDataState.amenities.includes(opt) ? '#fff' : '#333',
                      border: 'none',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      cursor: 'pointer'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
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
                <button type="button" className={styles.submitBtn} style={{ width: 'auto', padding: '0 20px' }} onClick={() => {
                  const val = customAmenityInput.trim();
                  if (val && !formDataState.amenities.includes(val)) {
                    setFormDataState({ ...formDataState, amenities: [...formDataState.amenities, val] });
                    setCustomAmenityInput("");
                  }
                }}>Add</button>
              </div>

              {/* Display Custom Added Amenities */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                {formDataState.amenities
                  .filter(a => !PREDEFINED_AMENITIES.includes(a))
                  .map((amenity, index) => (
                    <span key={index} style={{
                      background: '#fff3e0',
                      padding: '6px 12px',
                      borderRadius: '16px',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      border: '1px solid #ffcc80'
                    }}>
                      {amenity}
                      <button type="button" onClick={() => {
                        setFormDataState({ ...formDataState, amenities: formDataState.amenities.filter(a => a !== amenity) });
                      }} style={{
                        border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 'bold', color: '#666', padding: 0, display: 'flex', alignItems: 'center'
                      }}>
                        <X size={14} />
                      </button>
                    </span>
                  ))}
              </div>
            </div>

            {/* Policies Section */}
            <div style={{ marginBottom: '32px', borderTop: '1px solid #eee', paddingTop: '24px' }}>
              <h3 className={styles.label} style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Property Policies</h3>

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
              <div style={{ marginTop: '24px' }}>
                <label className={styles.label}>House Rules</label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
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
                  <button type="button" className={styles.submitBtn} style={{ width: 'auto', padding: '0 20px' }} onClick={() => {
                    const val = customHouseRuleInput.trim();
                    if (val && !formDataState.houseRules.includes(val)) {
                      setFormDataState({ ...formDataState, houseRules: [...formDataState.houseRules, val] });
                      setCustomHouseRuleInput("");
                    }
                  }}>Add</button>
                </div>

                {formDataState.houseRules.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {formDataState.houseRules.map((rule, index) => (
                      <span key={index} style={{
                        background: '#fff3e0',
                        padding: '6px 12px',
                        borderRadius: '16px',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        border: '1px solid #ffcc80'
                      }}>
                        {rule}
                        <button type="button" onClick={() => {
                          setFormDataState({ ...formDataState, houseRules: formDataState.houseRules.filter(r => r !== rule) });
                        }} style={{
                          border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 'bold', color: '#666', padding: 0, display: 'flex', alignItems: 'center'
                        }}>
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