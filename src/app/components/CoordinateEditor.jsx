'use client';
import { useState } from 'react';
import { updateLocationAction } from '@/app/serverActions/locationActions';
import styles from './CoordinateEditor.module.css';

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
            const result = await updateLocationAction(hotelId, parseFloat(lat), parseFloat(lng));

            if (result.success) {
                alert('Location Saved!');
                setIsOpen(false);
                if (onUpdate) onUpdate();
                window.location.reload(); // Simple reload to refresh map
            } else {
                alert('Failed to save location: ' + result.message);
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
                className={styles.editorButton}
            >
                 Set Real Location
            </button>
        );
    }

    return (
        <div
            onClick={(e) => e.stopPropagation()} // Prevent card navigation
            className={styles.editorContainer}
        >
            <h4 className={styles.editorTitle}>Edit Coordinates</h4>
            <div className={styles.inputRow}>
                <input
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    value={lat}
                    onChange={e => setLat(e.target.value)}
                    className={styles.inputField}
                />
                <input
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    value={lng}
                    onChange={e => setLng(e.target.value)}
                    className={styles.inputField}
                />
            </div>
            <div className={styles.actionRow}>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className={styles.saveBtn}
                >
                    {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setIsOpen(false);
                    }}
                    className={styles.cancelBtn}
                >
                    Cancel
                </button>
            </div>
            <p className={styles.tipText}>
                Tip: Google Maps {'>'} Right Click {'>'} Copy coordinates
            </p>
        </div>
    );
}
