'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./onboarding.module.css";
import { applyHostAction } from "@/app/serverActions/userActions";
// Ensure lucide-react is installed or use alternatives
import { Home, Building2, Palmtree, MapPin, CheckCircle } from "lucide-react";
import dynamic from 'next/dynamic';

// Dynamic import for Map to avoid SSR issues with Leaflet
const MapPicker = dynamic(() => import('@/app/components/MapPicker'), {
  ssr: false,
  loading: () => <div className={styles.mapLoading}>Loading Map...</div>
});

export default function HostOnboarding() {
  const [step, setStep] = useState(0); // 0 = detailed intro
  const [data, setData] = useState({
    propertyType: "",
    city: "",
    hostingExperience: "",
    hostingReason: "",
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
  });

  const [loading, setLoading] = useState(false);

  // Steps Configuration - Vihara Theme (Teal/Green)
  const steps = [
    { id: 0, title: "Welcome", bg: "rgb(3, 107, 90)" }, // Vihara Primary Teal
    { id: 1, title: "Property Type", bg: "#02594a" }, // Darker Teal
    { id: 2, title: "Location", bg: "#047d69" }, // Lighter Teal
    { id: 3, title: "About You", bg: "rgb(3, 107, 90)" }, // Primary Teal
    { id: 4, title: "Review", bg: "rgb(3, 107, 90)" }, // Vihara Primary Teal
  ];

  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("propertyType", data.propertyType);
      formData.append("city", data.city);
      formData.append("hostingExperience", data.hostingExperience);
      formData.append("hostingReason", data.hostingReason);
      formData.append("guests", data.guests);
      formData.append("bedrooms", data.bedrooms);
      formData.append("bathrooms", data.bathrooms);

      const result = await applyHostAction(formData);

      if (result.success) {
        alert('Application sent for approval! Redirecting...');
        window.location.href = '/host/dashboard';
      } else {
        alert(result.message || 'Failed to submit application.');
        if (result.message.includes("already")) {
          window.location.href = '/host/dashboard';
        }
      }
    } catch (e) {
      console.error(e);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    enter: { x: 100, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  return (
    <div className={styles.container}>
      {/* Left Panel - Dynamic Branding */}
      <motion.div
        className={styles.leftPanel}
        animate={{ background: `linear-gradient(135deg, ${steps[step]?.bg || 'rgb(3, 107, 90)'} 0%, #000 100%)` }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.logo}>Vihara Host</div>
        <div className={styles.leftContent}>
          {step === 0 && <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>It’s easy to get started on Vihara</motion.h1>}
          {step === 1 && <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>What kind of place will you host?</motion.h1>}
          {step === 2 && <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Where is your place located?</motion.h1>}
          {step === 3 && <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Tell us about yourself</motion.h1>}
          {step === 4 && <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Review your details</motion.h1>}
        </div>
      </motion.div>

      {/* Right Panel - Form */}
      <div className={styles.rightPanel}>
        <div className={`${styles.topBar} ${styles.topBarAlignRight}`}>
          <button className={`${styles.backBtn} ${styles.backBtnOutline}`}>Save & Exit</button>
        </div>

        <div className={styles.stepContainer}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* STEP 0: INTRO */}
              {step === 0 && (
                <div className={styles.textCenter}>
                  <h2 className={styles.stepTitle}>Join the community</h2>
                  <p className={styles.introSubtitle}>Earn money as a host on Vihara.</p>
                  <div className={styles.grid}>
                    {/* Visual placeholders */}
                  </div>
                </div>
              )}

              {/* STEP 1: TYPE */}
              {step === 1 && (
                <div>
                  <h2 className={styles.stepTitle}>Which of these best describes your place?</h2>
                  <div className={styles.grid}>
                    {['Hotel', 'Resort', 'Villa', 'Apartment', 'Cabin', 'Cottage'].map(type => (
                      <div
                        key={type}
                        className={`${styles.card} ${data.propertyType === type ? styles.selected : ''}`}
                        onClick={() => handleChange('propertyType', type)}
                      >
                        <Building2 size={32} />
                        <span>{type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: LOCATION */}
              {step === 2 && (
                <div>
                  <h2 className={styles.stepTitle}>Where's your place located?</h2>
                  <p className={styles.locationSubtitle}>Your address is only shared with guests after they make a reservation.</p>
                  <input
                    className={styles.input}
                    placeholder="Enter your city"
                    value={data.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                  />
                  {/* Live Map Integration */}
                  <div className={styles.mapWrapper}>
                    <MapPicker city={data.city} />
                  </div>
                </div>
              )}

              {/* STEP 3: DETAILS */}
              {step === 3 && (
                <div>
                  <h2 className={styles.stepTitle}>Tell us about your experience</h2>
                  <input
                    className={styles.input}
                    placeholder="Hosting Experience (e.g. 2 years on Airbnb)"
                    value={data.hostingExperience}
                    onChange={(e) => handleChange('hostingExperience', e.target.value)}
                  />
                  <textarea
                    className={styles.textarea}
                    placeholder="Why do you want to host on Vihara? (e.g. I have a new resort...)"
                    value={data.hostingReason}
                    onChange={(e) => handleChange('hostingReason', e.target.value)}
                  />
                </div>
              )}

              {/* STEP 4: REVIEW */}
              {step === 4 && (
                <div>
                  <h2 className={styles.stepTitle}>Check your details</h2>
                  <div className={`${styles.card} ${styles.reviewCard}`}>
                    <p><strong>Type:</strong> {data.propertyType}</p>
                    <p><strong>City:</strong> {data.city}</p>
                    <p><strong>Experience:</strong> {data.hostingExperience}</p>
                    <p><strong>Reason:</strong> {data.hostingReason}</p>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Controls */}
        <div className={styles.controls}>
          <button
            onClick={back}
            disabled={step === 0}
            className={`${styles.backBtn} ${step === 0 ? styles.hidden : ''}`}
          >
            Back
          </button>

          {step < 4 ? (
            <button
              className={styles.nextBtn}
              onClick={next}
              // Simple validation
              disabled={
                (step === 1 && !data.propertyType) ||
                (step === 2 && !data.city) ||
                (step === 3 && !data.hostingExperience)
              }
            >
              {step === 0 ? 'Get Started' : 'Next'}
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={loading}
              className={`${styles.nextBtn} ${styles.submitBtnActive}`}
            >
              {loading ? 'Submitting...' : 'Submit Properties'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
