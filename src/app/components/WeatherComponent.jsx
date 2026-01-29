'use client';
import { useState, useEffect } from 'react';
import styles from './WeatherComponent.module.css';

export default function WeatherComponent({ lat, lng, city }) {
    const [current, setCurrent] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [daily, setDaily] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!lat || !lng) return;

        const fetchWeather = async () => {
            try {
                // Fetch Current + Hourly + Daily (7 Days)
                const res = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
                );
                const data = await res.json();

                setCurrent(data.current_weather);

                // Process Hourly Data (Next 5 hours)
                // OpenMeteo gives arrays [0,1,2...], we need to match with current time
                const hourIndex = new Date().getHours();
                const next5Hours = [];

                for (let i = 1; i <= 5; i++) {
                    const idx = hourIndex + i; // simplistic index, assumes data starts at 00:00 today
                    // safety check if index exists
                    if (data.hourly && data.hourly.time[idx]) {
                        next5Hours.push({
                            time: data.hourly.time[idx], // ISO string
                            temp: data.hourly.temperature_2m[idx],
                            code: data.hourly.weathercode[idx]
                        });
                    }
                }
                setForecast(next5Hours);

                // Process Daily (7 Days)
                const next7Days = [];
                if (data.daily) {
                    for (let i = 0; i < data.daily.time.length; i++) {
                        next7Days.push({
                            time: data.daily.time[i],
                            max: data.daily.temperature_2m_max[i],
                            min: data.daily.temperature_2m_min[i],
                            code: data.daily.weathercode[i]
                        });
                    }
                }
                setDaily(next7Days);
                setLoading(false);
            } catch (err) {
                console.error("Weather fetch error", err);
                setLoading(false);
            }
        };

        fetchWeather();
    }, [lat, lng]);

    if (loading) return <div className={styles.weatherWidget} style={{ height: '200px' }}></div>;
    if (!current) return null;

    const getWeatherIcon = (code) => {
        if (code <= 3) return "☀️";
        if (code <= 48) return "☁️";
        if (code <= 67) return "🌧️";
        if (code >= 95) return "⛈️";
        return "🌥️";
    };

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
    };

    const getDayName = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString([], { weekday: 'long' });
    };

    return (
        <>
            <div className={styles.weatherWidget}>
                <div className={styles.header}>
                    <div className={styles.location}>
                        📍 {city}
                    </div>
                    <div style={{ fontSize: '1.2rem' }}>...</div>
                </div>

                <div className={styles.mainTemp}>
                    <div className={styles.bigTemp}>{Math.round(current.temperature)}°</div>
                    <div className={styles.condition}>
                        <span style={{ fontSize: '1.5rem' }}>{getWeatherIcon(current.weathercode)}</span>
                        <span style={{ fontSize: '0.85rem' }}>Current</span>
                    </div>
                </div>

                <div className={styles.forecastGrid}>
                    {forecast.map((item, index) => (
                        <div key={index} className={styles.forecastItem}>
                            <span className={styles.time}>{formatTime(item.time)}</span>
                            <span className={styles.icon}>{getWeatherIcon(item.code)}</span>
                            <span className={styles.tempSmall}>{Math.round(item.temp)}°</span>
                        </div>
                    ))}
                </div>

                <div
                    onClick={() => setShowModal(true)}
                    style={{
                        textAlign: 'center',
                        marginTop: '16px',
                        fontSize: '0.8rem',
                        background: 'rgba(255,255,255,0.2)',
                        padding: '8px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        fontWeight: '600'
                    }}
                >
                    See full forecast
                </div>
            </div>

            {/* Full Forecast Modal */}
            {showModal && (
                <div className={styles.modalBackdrop} onClick={() => setShowModal(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={() => setShowModal(false)}>×</button>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>7-Day Forecast</h2>

                        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px' }}>
                            {daily.map((day, idx) => (
                                <div key={idx} className={styles.dailyRow}>
                                    <span className={styles.dayName}>{idx === 0 ? 'Today' : getDayName(day.time)}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '1.2rem' }}>{getWeatherIcon(day.code)}</span>
                                        <div className={styles.dailyTemp}>
                                            <span style={{ opacity: 1 }}>{Math.round(day.max)}°</span>
                                            <span style={{ opacity: 0.6, marginLeft: '8px' }}>{Math.round(day.min)}°</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
