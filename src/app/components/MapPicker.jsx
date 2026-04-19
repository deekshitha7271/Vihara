'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
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

// Component to handle map clicks
function LocationMarker({ onSelect }) {
    useMapEvents({
        click(e) {
            onSelect(e.latlng);
        },
    });
    return null;
}

export default function MapPicker({ city, lat, lng, onLocationSelect }) {
    const [position, setPosition] = useState([20.5937, 78.9629]); // Default India

    // Effect to update map when manual coordinates change
    useEffect(() => {
        if (lat && lng) {
            const newPos = [parseFloat(lat), parseFloat(lng)];
            if (!isNaN(newPos[0]) && !isNaN(newPos[1])) {
                setPosition(newPos);
            }
        }
    }, [lat, lng]);

    // Effect to geocode city name when it changes (only if no manual coords)
    useEffect(() => {
        if (!city || (lat && lng)) return;

        const delayDebounceFn = setTimeout(async () => {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
                const data = await response.json();
                if (data && data.length > 0) {
                    const { lat: newLat, lon } = data[0];
                    const newPos = [parseFloat(newLat), parseFloat(lon)];
                    setPosition(newPos);
                    if (onLocationSelect) onLocationSelect({ lat: newPos[0], lng: newPos[1] });
                }
            } catch (error) {
                console.error("Geocoding failed", error);
            }
        }, 1000);

        return () => clearTimeout(delayDebounceFn);
    }, [city]);

    const handleMapClick = (latlng) => {
        setPosition([latlng.lat, latlng.lng]);
        if (onLocationSelect) onLocationSelect({ lat: latlng.lat, lng: latlng.lng });
    };

    return (
        <div className="mapPickerContainer">
            <MapContainer center={position} zoom={5} className="w100" style={{ height: '100%' }}>
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
                <LocationMarker onSelect={handleMapClick} />
            </MapContainer>
        </div>
    );
}
