'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './LocationManager.module.css'; // We'll create this next
import { deleteLocationAction, updateLocationDetailsAction } from '@/app/serverActions/locationActions';

export default function LocationManagerClient({ initialLocations }) {
    const [locations, setLocations] = useState(initialLocations);
    const [editingLoc, setEditingLoc] = useState(null);

    async function handleDelete(id) {
        if (!confirm("Are you sure you want to delete this location?")) return;

        const res = await deleteLocationAction(id);
        if (res.success) {
            setLocations(prev => prev.filter(loc => loc._id !== id));
            alert("Deleted successfully");
        } else {
            alert("Failed: " + res.message);
        }
    }

    async function handleUpdate(formData) {
        const res = await updateLocationDetailsAction(formData);
        if (res.success) {
            alert("Updated successfully");
            window.location.reload(); // Reload to get fresh data/images
        } else {
            alert("Failed: " + res.message);
        }
    }

    return (
        <div>
            {/* Grid of Locations */}
            <div className={styles.grid}>
                {locations.map(loc => (
                    <div key={loc._id} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            <Image
                                src={loc.image}
                                alt={loc.location}
                                fill
                                className={styles.coverImage}
                            />
                        </div>
                        <div className={styles.cardContent}>
                            <h3>{loc.location}</h3>
                            <p className={styles.category}>{loc.category}</p>
                            <p className={styles.desc}>{loc.description}</p>
                            <div className={styles.actions}>
                                <button
                                    onClick={() => setEditingLoc(loc)}
                                    className={styles.editBtn}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(loc._id)}
                                    className={styles.deleteBtn}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {editingLoc && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Edit Location</h2>
                        <form action={handleUpdate} className={styles.form}>
                            <input type="hidden" name="id" value={editingLoc._id} />

                            <label>
                                Location Name
                                <input
                                    type="text"
                                    name="location"
                                    defaultValue={editingLoc.location}
                                    required
                                />
                            </label>

                            <label>
                                Category
                                <input
                                    type="text"
                                    name="category"
                                    defaultValue={editingLoc.category}
                                />
                            </label>

                            <label>
                                Description
                                <textarea
                                    name="description"
                                    defaultValue={editingLoc.description}
                                    rows={4}
                                />
                            </label>

                            <label>
                                Change Image (Optional)
                                <input type="file" name="image" accept="image/*" />
                            </label>

                            <div className={styles.modalActions}>
                                <button type="submit" className={styles.saveBtn}>Save Changes</button>
                                <button
                                    type="button"
                                    onClick={() => setEditingLoc(null)}
                                    className={styles.cancelBtn}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
