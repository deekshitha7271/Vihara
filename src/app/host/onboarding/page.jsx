'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./onboarding.module.css";
// Ensure lucide-react is installed or use alternatives
import { Home, Building2, Palmtree, MapPin, CheckCircle } from "lucide-react";

export default function HostOnboarding() {
  const [step, setStep] = useState(0); // 0 = detailed intro
  const [data, setData] = useState({
    propertyType: "",
    city: "",
    propertyName: "",
    description: "",
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
    { id: 3, title: "Details", bg: "rgb(3, 107, 90)" }, // Primary Teal
    { id: 4, title: "Review", bg: "rgb(46, 43, 43)" }, // Vihara Dark Grey (Nav)
  ];

  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async () => {
    setLoading(true);
    try {
      // Ensuring guest/room data is formatted if API expects it, or just send core data
      const payload = {
        ...data,
        // Add any defaults if needed by schema
      };

      const res = await fetch('/api/host/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Application sent for approval! Redirecting...');
        window.location.href = '/host/dashboard';
      } else {
        const errorData = await res.json();
        // If already submitted, redirect to dashboard anyway
        if (res.status === 409) {
          alert(errorData.message);
          window.location.href = '/host/dashboard';
          return;
        }
        alert(errorData.message || 'Failed to submit application.');
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
          {step === 3 && <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Let's give your place a name</motion.h1>}
          {step === 4 && <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Review your details</motion.h1>}
        </div>
      </motion.div>

      {/* Right Panel - Form */}
      <div className={styles.rightPanel}>
        <div className={styles.topBar} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className={styles.backBtn} style={{ textDecoration: 'none', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '20px' }}>Save & Exit</button>
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
                <div style={{ textAlign: 'center' }}>
                  <h2 className={styles.stepTitle}>Join the community</h2>
                  <p style={{ marginBottom: '2rem', color: '#666' }}>Earn money as a host on Vihara.</p>
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
                  <p style={{ marginBottom: '1rem', color: '#666' }}>Your address is only shared with guests after they make a reservation.</p>
                  <input
                    className={styles.input}
                    placeholder="Enter your city"
                    value={data.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                  />
                  {/* Map Placeholder */}
                  <div style={{ height: '300px', background: '#f0f0f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                    <MapPin size={48} />
                    <span style={{ marginLeft: '10px' }}>Map Preview</span>
                  </div>
                </div>
              )}

              {/* STEP 3: DETAILS */}
              {step === 3 && (
                <div>
                  <h2 className={styles.stepTitle}>Give your place a title and description</h2>
                  <input
                    className={styles.input}
                    placeholder="Property Title (e.g. Seaside Villa)"
                    value={data.propertyName}
                    onChange={(e) => handleChange('propertyName', e.target.value)}
                  />
                  <textarea
                    className={styles.textarea}
                    placeholder="Describe your place..."
                    value={data.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                  />
                </div>
              )}

              {/* STEP 4: REVIEW */}
              {step === 4 && (
                <div>
                  <h2 className={styles.stepTitle}>Check your details</h2>
                  <div className={styles.card} style={{ alignItems: 'flex-start', background: '#f9f9f9' }}>
                    <p><strong>Type:</strong> {data.propertyType}</p>
                    <p><strong>City:</strong> {data.city}</p>
                    <p><strong>Name:</strong> {data.propertyName}</p>
                    <p><strong>Description:</strong> {data.description}</p>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Controls */}
        <div className={styles.controls}>
          <button
            className={styles.backBtn}
            onClick={back}
            disabled={step === 0}
            style={{ opacity: step === 0 ? 0 : 1 }}
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
                (step === 3 && !data.propertyName)
              }
            >
              {step === 0 ? 'Get Started' : 'Next'}
            </button>
          ) : (
            <button
              className={styles.nextBtn}
              onClick={submit}
              disabled={loading}
              style={{ background: 'rgb(3, 107, 90)' }}
            >
              {loading ? 'Submitting...' : 'Submit Properties'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
