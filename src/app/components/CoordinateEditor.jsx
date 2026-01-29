'use client';
import { useState } from 'react';

export default function CoordinateEditor({ hotelId, currentLat, currentLng, onUpdate }) {
    const [isOpen, setIsOpen] = useState(false);
    const [lat, setLat] = useState(currentLat || '');
    const [lng, setLng] = useState(currentLng || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent card click navigation
        setLoading(true);

        try {
            const res = await fetch('/api/hotels/update-location', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hotelId, lat: parseFloat(lat), lng: parseFloat(lng) })
            });

            if (res.ok) {
                alert('Location Saved!');
                setIsOpen(false);
                if (onUpdate) onUpdate();
                window.location.reload(); // Simple reload to refresh map
            } else {
                alert('Failed to save location');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving location');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(true);
                }}
                style={{
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    background: '#f0f0f0',
                    border: '1px solid #ddd',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    color: '#555',
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}
            >
                📍 Set Real Location
            </button>
        );
    }

    return (
        <div
            onClick={(e) => e.stopPropagation()} // Prevent card navigation
            style={{
                marginTop: '10px',
                padding: '16px',
                background: '#fafafa',
                border: '1px solid #eee',
                borderRadius: '12px'
            }}
        >
            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem' }}>Edit Coordinates</h4>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <input
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    value={lat}
                    onChange={e => setLat(e.target.value)}
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', width: '100px' }}
                />
                <input
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    value={lng}
                    onChange={e => setLng(e.target.value)}
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', width: '100px' }}
                />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    style={{
                        padding: '6px 12px',
                        background: '#036b5a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                    }}
                >
                    {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setIsOpen(false);
                    }}
                    style={{
                        padding: '6px 12px',
                        background: 'transparent',
                        color: '#666',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                    }}
                >
                    Cancel
                </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '8px' }}>
                Tip: Google Maps {'>'} Right Click {'>'} Copy coordinates
            </p>
        </div>
    );
}
