'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Star, Zap } from 'lucide-react';

import styles from '../(user)/detail/[id]/detail.module.css';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BookingSidebar({ hotel }) {
    const { data: session } = useSession();
    const [showCalendar, setShowCalendar] = useState(false);
    const [date, setDate] = useState([
        {
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000 * 5),
            key: 'selection'
        }
    ]);
    const maxGuests = hotel.facilities?.guests || 2;
    const [guests, setGuests] = useState(maxGuests);
    const [loading, setLoading] = useState(false);
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [isAvailable, setIsAvailable] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const calendarRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [calendarRef]);

    useEffect(() => {
        const checkAvailability = async () => {
            if (date[0].startDate.toDateString() === date[0].endDate.toDateString()) return;
            
            setCheckingAvailability(true);
            try {
                const res = await fetch(`/api/bookings/check-availability?hotelId=${hotel._id}&checkIn=${date[0].startDate.toISOString()}&checkOut=${date[0].endDate.toISOString()}`);
                const data = await res.json();
                setIsAvailable(data.available);
            } catch (error) {
                console.error("Availability check failed:", error);
            } finally {
                setCheckingAvailability(false);
            }
        };

        const timeoutId = setTimeout(checkAvailability, 500);
        return () => clearTimeout(timeoutId);
    }, [date, hotel._id]);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
    };

    // Stripe integration logic replaces Razorpay here.

    const diffTime = Math.abs(date[0].endDate.getTime() - date[0].startDate.getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    const nightsCost = hotel.price * nights;
    const cleaningFee = Math.round(nightsCost * 0.05);
    const serviceFee = Math.round(nightsCost * 0.10);
    const totalBeforeTaxes = nightsCost + cleaningFee + serviceFee;

    const handleReserve = async () => {
        if (!session) {
            showToast('You need to be logged in to experience Vihara.', 'error');
            return;
        }

        if (date[0].startDate.toDateString() === date[0].endDate.toDateString()) {
            showToast('Minimum stay is 1 night.', 'error');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    hotelId: hotel._id,
                    checkIn: date[0].startDate.toISOString(),
                    checkOut: date[0].endDate.toISOString(),
                    guests,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                showToast(data.message || "Failed to initiate checkout.", "error");
                setLoading(false);
                return;
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                showToast("Something went wrong. Please try again.", "error");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            showToast("An unexpected error occurred.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <React.Fragment>

            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className={`${styles.toastWrapper} ${toast.type === 'error' ? styles.toastError : styles.toastSuccess}`}
                    >
                        {toast.type === 'error' ? (
                            <div className={styles.toastIconError}>!</div>
                        ) : (
                            <div className={styles.toastIconSuccess}>✓</div>
                        )}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={styles.bookingSidebarWrapper}
            >
                <div className={styles.bookingSidebarHeader}>
                    <div>
                        <span className={styles.bookingSidebarPrice}>₹{hotel.price.toLocaleString()}</span>
                        <span className={styles.bookingSidebarNight}>/ night</span>
                    </div>
                </div>

                <div className={styles.bookingSidebarControls}>
                    <div
                        onClick={() => setShowCalendar(!showCalendar)}
                        className={styles.bookingSidebarDateRow}
                    >
                        <div className={styles.bookingSidebarDateCol}>
                            <span className={styles.bookingSidebarLabel}>Check-In</span>
                            <div className={styles.bookingSidebarValue}>{date[0].startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        </div>
                        <div className={styles.bookingSidebarDateCol}>
                            <span className={styles.bookingSidebarLabel}>Checkout</span>
                            <div className={styles.bookingSidebarValue}>{date[0].endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showCalendar && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                ref={calendarRef}
                                className={styles.bookingSidebarCalendarWrapper}
                            >
                                <DateRange
                                    editableDateInputs={true}
                                    onChange={item => setDate([item.selection])}
                                    moveRangeOnFirstSelection={false}
                                    ranges={date}
                                    minDate={new Date()}
                                    rangeColors={['#222']}
                                    className="custom-date-range"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className={styles.bookingSidebarGuestsRow}>
                        <span className={styles.bookingSidebarLabel}>Guests</span>
                        <div className={styles.bookingSidebarGuestsFlex}>
                            <span className={styles.bookingSidebarValue}>{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
                            <div className={styles.bookingSidebarGuestControls}>
                                <button
                                    onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                                    className={styles.bookingSidebarGuestBtn}
                                >
                                    -
                                </button>
                                <button
                                    onClick={() => setGuests(prev => Math.min(maxGuests, prev + 1))}
                                    className={styles.bookingSidebarGuestBtn}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                    <motion.button
                        whileHover={isAvailable ? { scale: 1.02 } : {}}
                        whileTap={isAvailable ? { scale: 0.98 } : {}}
                        onClick={handleReserve}
                        disabled={loading || !isAvailable || checkingAvailability}
                        className={`${styles.bookingSidebarReserveBtn} ${!isAvailable ? styles.btnDisabled : ''}`}
                    >
                        {loading ? (
                            <div className={styles.bookingSidebarLoader} />
                        ) : checkingAvailability ? (
                            "Checking availability..."
                        ) : !isAvailable ? (
                            "Unavailable for these dates"
                        ) : (
                            <>
                                <Zap size={18} fill="#ffcc00" color="#ffcc00" />
                                Book Now securely
                            </>
                        )}
                    </motion.button>
                <style jsx>{`
                :global(.custom-date-range .rdrDayToday .rdrDayNumber span:after) {
                    background: #222 !important;
                }
            `}</style>

                <div className={styles.bookingSidebarChargeText}>
                    You won't be charged until confirmed
                </div>

                <div className={styles.bookingSidebarCostDetails}>
                    <div className={styles.bookingSidebarCostRow}>
                        <span className={styles.bookingSidebarCostLabel}>₹{hotel.price.toLocaleString()} x {nights} nights</span>
                        <span>₹{nightsCost.toLocaleString()}</span>
                    </div>
                    {cleaningFee > 0 && (
                        <div className={styles.bookingSidebarCostRow}>
                            <span className={styles.bookingSidebarCostLabel}>Cleaning fee</span>
                            <span>₹{cleaningFee.toLocaleString()}</span>
                        </div>
                    )}
                    {serviceFee > 0 && (
                        <div className={styles.bookingSidebarCostRow}>
                            <span className={styles.bookingSidebarCostLabel}>Vihara service fee</span>
                            <span>₹{serviceFee.toLocaleString()}</span>
                        </div>
                    )}
                </div>

                <div className={styles.bookingSidebarTotalRow}>
                    <span>Total</span>
                    <span>₹{totalBeforeTaxes.toLocaleString()}</span>
                </div>
            </motion.div>


        </React.Fragment>
    );
}
