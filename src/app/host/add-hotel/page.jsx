'use client';

import { useEffect, useState } from "react";

export default function AddHotel() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  const [allowedLocations, setAllowedLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch allowed locations for this host
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

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!location) {
      alert("Please select a location");
      return;
    }

    const data = new FormData();
    data.append("image", image);
    data.append("name", name);
    data.append("location", location);
    data.append("description", description);
    data.append("category", category);
    data.append("price", price);

    const res = await fetch("/api/host/add-hotel", {
      method: "POST",
      body: data
    });

    const result = await res.json();

    if (result.success) {
      alert("Hotel submitted for approval");
      setName("");
      setDescription("");
      setCategory("");
      setPrice("");
      setImage(null);
      setLocation("");
    } else {
      alert(result.message || "Failed to add hotel");
    }
  };

  if (loading) return <p>Loading allowed locations...</p>;

  return (
    <form onSubmit={submitHandler} encType="multipart/form-data">
      <input
        type="file"
        required
        onChange={(e) => setImage(e.target.files[0])}
      />

      <input
        placeholder="Hotel name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* 🔐 LOCATION DROPDOWN (NO FREE TEXT) */}
      <select
        required
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      >
        <option value="">Select Location</option>
        {Array.isArray(allowedLocations) &&
  allowedLocations.map((loc) => (
    <option key={loc._id} value={loc.location}>
      {loc.location}
    </option>
  ))
}

      </select>

      <input
        placeholder="Category"
        required
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
        placeholder="Price"
        type="number"
        required
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <textarea
        placeholder="Description"
        required
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
