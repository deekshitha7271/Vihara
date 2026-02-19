'use client';

import { useState } from 'react';
import styles from './detail.module.css';
import { X } from 'lucide-react';

export default function ThingsToKnow({ hotel }) {
    const [activeModal, setActiveModal] = useState(null); // 'rules', 'safety', 'cancellation'

    const openModal = (type) => setActiveModal(type);
    const closeModal = () => setActiveModal(null);

    // Prevent scrolling when modal is open
    if (typeof window !== 'undefined') {
        document.body.style.overflow = activeModal ? 'hidden' : 'auto';
    }

    return (
        <div className={styles.thingsSection}>
            <h2 className={styles.amenitiesTitle}>Things to know</h2>
            <div className={styles.thingsGrid}>

                {/* Column 1: House Rules */}
                {/* Column 1: Check-in/out */}
                <div className={styles.thingColumn}>
                    <div className={styles.thingTitle}>Check-in & out</div>
                    <span className={styles.thingText}>Check-in after {hotel.checkInTime}</span>
                    <span className={styles.thingText}>Checkout before {hotel.checkOutTime}</span>
                </div>

                {/* Column 2: House Rules */}
                <div className={styles.thingColumn}>
                    <div className={styles.thingTitle}>House rules</div>
                    <span className={styles.thingText}>{hotel.facilities?.guests} guests maximum</span>

                    {/* Show a few rules as preview */}
                    {hotel.houseRules?.slice(0, 2).map((rule, i) => (
                        <span key={i} className={styles.thingText}>{rule}</span>
                    ))}

                    <button className={styles.thingLink} onClick={() => openModal('rules')}>
                        Show more &gt;
                    </button>
                </div>

                {/* Column 3: Safety */}
                <div className={styles.thingColumn}>
                    <div className={styles.thingTitle}>Safety & property</div>
                    <span className={styles.thingText}>Security camera/recording device</span>
                    <span className={styles.thingText}>Smoke alarm</span>
                    <span className={styles.thingText}>Carbon monoxide alarm</span>
                    <button className={styles.thingLink} onClick={() => openModal('safety')}>
                        Show more &gt;
                    </button>
                </div>

                {/* Column 3: Cancellation */}
                <div className={styles.thingColumn}>
                    <div className={styles.thingTitle}>Cancellation policy</div>
                    <span className={styles.thingText}>Free cancellation for 48 hours.</span>
                    <span className={styles.thingText}>Review the Host's full cancellation policy...</span>
                    <button className={styles.thingLink} onClick={() => openModal('cancellation')}>
                        Show more &gt;
                    </button>
                </div>
            </div>

            {/* MODAL */}
            {activeModal && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={closeModal}><X size={20} /></button>

                        {activeModal === 'rules' && (
                            <>
                                <h2 className={styles.modalTitle}>House Rules</h2>
                                <div className={styles.modalSection}>
                                    <h3>During your stay</h3>
                                    <div className={styles.modalRow}>
                                        <span>{hotel.facilities?.guests} guests maximum</span>
                                    </div>
                                    {hotel.houseRules?.map((rule, i) => (
                                        <div key={i} className={styles.modalRow}>
                                            <span>{rule}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {activeModal === 'safety' && (
                            <>
                                <h2 className={styles.modalTitle}>Safety & Property</h2>
                                <div className={styles.modalSection}>
                                    <h3>Safety Devices</h3>
                                    <p className={styles.modalText}>Security camera/recording device</p>
                                    <p className={styles.modalText}>Smoke alarm</p>
                                    <p className={styles.modalText}>Carbon monoxide alarm</p>
                                </div>
                            </>
                        )}

                        {activeModal === 'cancellation' && (
                            <>
                                <h2 className={styles.modalTitle}>Cancellation Policy</h2>
                                <div className={styles.modalSection}>
                                    <p className={styles.modalText}>Free cancellation for 48 hours.</p>
                                    <p className={styles.modalText}>Review the Host's full cancellation policy which applies even if you cancel for illness or disruptions caused by COVID-19.</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
