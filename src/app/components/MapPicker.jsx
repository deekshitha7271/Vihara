'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Next.js/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to update map center when coordinates change
function ChangeView({ center }) {
    const map = useMap();
    map.setView(center, 13);
    return null;
}

export default function MapPicker({ city, onLocationSelect }) {
    const [position, setPosition] = useState([20.5937, 78.9629]); // Default India
    const [searchTerm, setSearchTerm] = useState('');

    // Effect to geocode city name when it changes
    useEffect(() => {
        if (!city) return;

        const delayDebounceFn = setTimeout(async () => {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
                const data = await response.json();
                if (data && data.length > 0) {
                    const { lat, lon } = data[0];
                    const newPos = [parseFloat(lat), parseFloat(lon)];
                    setPosition(newPos);
                    // Optionally notify parent of coordinates if needed
                    // onLocationSelect({ lat: newPos[0], lng: newPos[1] });
                }
            } catch (error) {
                console.error("Geocoding failed", error);
            }
        }, 1000); // Debounce to avoid hitting API while typing too fast

        return () => clearTimeout(delayDebounceFn);
    }, [city]);

    return (
        <div style={{ height: '300px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #ddd', zIndex: 0 }}>
            <MapContainer center={position} zoom={5} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        {city || "Selected Location"}
                    </Popup>
                </Marker>
                <ChangeView center={position} />
            </MapContainer>
        </div>
    );
}
