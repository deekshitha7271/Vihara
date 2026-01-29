'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default marker icon in Leaflet with Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export default function MapComponent({ hotels }) {
    // Use hotels directly.
    // The previous filter (lng > 76.15) was too strict and hid your valid point (76.01).
    // Now just checking if lat/lng are numbers.
    const validHotels = hotels.filter(h => h.lat && h.lng && !isNaN(h.lat) && !isNaN(h.lng));

    // If no hotels have valid location, default to Kerala center
    const defaultCenter = [9.9312, 76.2673];
    const mapCenter = validHotels.length > 0
        ? [validHotels[0].lat, validHotels[0].lng]
        : defaultCenter;

    return (
        <MapContainer
            key={JSON.stringify(mapCenter)}
            center={mapCenter}
            zoom={10}
            style={{ height: "100%", width: "100%", borderRadius: "20px" }}
            scrollWheelZoom={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {validHotels.map((hotel) => (
                <Marker
                    key={hotel._id}
                    position={[hotel.lat, hotel.lng]}
                    icon={icon}
                >
                    <Popup>
                        <div style={{ width: '200px', padding: '0px' }}>
                            {hotel.image && (
                                <div style={{
                                    width: '100%',
                                    height: '100px',
                                    backgroundImage: `url(${hotel.image})`,
                                    backgroundSize: 'cover',
                                    borderRadius: '8px 8px 0 0',
                                    marginBottom: '8px'
                                }} />
                            )}
                            <div style={{ padding: '0 4px 4px' }}>
                                <strong style={{ fontSize: '1rem', display: 'block', marginBottom: '4px' }}>{hotel.name}</strong>
                                <span style={{ color: '#036b5a', fontWeight: 'bold' }}>₹{hotel.price}</span> / night
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
