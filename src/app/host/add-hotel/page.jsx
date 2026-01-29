'use client';

import { useEffect, useState } from "react";
import HostSidebar from "@/app/components/HostSidebar";
import styles from "./addHotel.module.css";
import { Upload, X } from "lucide-react";
// Since HostSidebar is a client component logic-wise (uses hooks), we can import it.
// But wait, the Sidebar uses Link and usePathname which are client-side.
// This page is a client component ('use client').

export default function AddHotel() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [allowedLocations, setAllowedLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!location) {
      alert("Please select a location");
      return;
    }

    setSubmitting(true);

    const data = new FormData();
    data.append("image", image);
    data.append("name", name);
    data.append("location", location);
    data.append("description", description);
    data.append("category", category);
    data.append("price", price);
    data.append("lat", lat);
    data.append("lng", lng);

    try {
      const res = await fetch("/api/host/add-hotel", {
        method: "POST",
        body: data
      });
      const result = await res.json();

      if (result.success) {
        alert("Success! Your property has been submitted for approval.");
        window.location.href = '/host/my-hotels';
      } else {
        alert(result.message || "Failed to add hotel");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Sidebar - We need to pass username, but this is a client component.
          In a real app, we'd use a context or fetch session.
          For now, let's assume Sidebar handles missing username gracefully or we fetch it.
      */}
      <HostSidebar />

      <div className={styles.main}>
        <div className={styles.formCard}>
          <div className={styles.header}>
            <h1 className={styles.title}>List a New Property</h1>
            <p className={styles.subtitle}>Fill in the details below to add your hotel, resort, or stay to Vihara.</p>
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
                  required={!image}
                  suppressHydrationWarning
                />
              </div>
            </div>

            <div className={styles.grid}>
              <div>
                <label className={styles.label}>Property Name</label>
                <input
                  className={styles.input}
                  placeholder="e.g. Vihara Resort & Spa"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  suppressHydrationWarning
                />
              </div>
              <div>
                <label className={styles.label}>Category</label>
                <select
                  className={styles.select}
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  suppressHydrationWarning
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
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={loading}
                  suppressHydrationWarning
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
                  placeholder="0.00"
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  suppressHydrationWarning
                />
              </div>
            </div>

            {/* Exact Location for Maps */}
            <div className={styles.grid}>
              <div>
                <label className={styles.label}>Latitude</label>
                <input
                  className={styles.input}
                  placeholder="e.g. 9.9312"
                  type="number"
                  step="any"
                  required
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                />
              </div>
              <div>
                <label className={styles.label}>Longitude</label>
                <input
                  className={styles.input}
                  placeholder="e.g. 76.2673"
                  type="number"
                  step="any"
                  required
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                />
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '-12px', marginBottom: '24px' }}>
              * Right-click on Google Maps to get these coordinates. This ensures your hotel appears correctly on the map.
            </p>

            <div style={{ marginBottom: '24px' }}>
              <label className={styles.label}>Description</label>
              <textarea
                className={styles.textarea}
                placeholder="Describe your property, amenities, and what makes it special..."
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                suppressHydrationWarning
              />
            </div>

            <div className={styles.actions}>
              <a href="/host/dashboard" className={styles.cancelBtn}>Cancel</a>
              <button type="submit" className={styles.submitBtn} disabled={submitting} suppressHydrationWarning>
                {submitting ? 'Submitting...' : 'Submit Property'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
