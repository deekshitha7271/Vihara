// 'use client'

// import Image from 'next/image';
// import Link from 'next/link'
// import React, {useState,useEffect } from 'react'
// import { Circles } from "react-loader-spinner";

// const LocationCollection = () => {
//     const [collections,setCollections]=useState()
//     const collectionHandler=async()=>{
//         const response=await fetch(`http://localhost:3000/api/admin/add-location`)
//         const newData = await response.json()
//         console.log("productData:",newData)
//         setCollections(newData.data)


//     }
     
//     useEffect(()=>{
//         collectionHandler()
        
//     },[])
   
//  return (
    
//     <div>
//       <h1>Your Stay Your Story</h1>
//       {collections ? collections.map((item) => {
//         return (
//           <div key={item._id}>
//             <h1>{item.location}</h1>
//             <Image src={item.image} alt={item.location} width={500} height={300} />
//           </div>
//         )
//       }) : <></>}
//     </div>
//   );
// }

// export default LocationCollection;

'use client'

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Circles } from "react-loader-spinner";
import styles from "./LocationCollection.module.css";

export default function LocationCollection() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Wellness");

  useEffect(() => {
    async function fetchCollections() {
      try {
        const res = await fetch("http://localhost:3000/api/admin/add-location");
        const json = await res.json();
        setCollections(json.data || []);
        console.log("fetched",collections)
      } catch (e) {
        console.error("fetch error:", e);
        setCollections([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCollections();
  }, []);

  const tabs = [
  { label: "Wellness", value: "Wellness" },
  { label: "Family", value: "Family" },
  { label: "All-Inclusive", value: "All-Inclusive" },
  { label: "Short Gateways", value: "Short Gateways" },
  { label: "All", value: "All" },

  ];

  const filteredCollections = collections.filter((item) => {
  if (!item) return false;
  if (activeTab === "All") return true;
  const cat = (item.category || "").toString().trim().toLowerCase();
  return cat === activeTab.toString().trim().toLowerCase();
  });
//   const filteredCollections = collections.filter((item) => {
//   if (!item) return false;
//   if (activeTab === "All") return true;
//   const cat = (item.category || "").toString().trim().toLowerCase();
//   return cat === activeTab.toString().trim().toLowerCase();
// });




  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title}>Your Stay, Your Story</h2>

          <nav className={styles.tabs} aria-label="collection categories">
            {tabs.map((t) => (
              <button
                key={t.value}
                className={`${styles.tab} ${t.value === activeTab ? styles.active : ""}`}
                onClick={() => setActiveTab(t.value)}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </header>

        <div className={styles.underline} aria-hidden />

        {loading ? (
          <div className={styles.loaderWrap}>
            <Circles height="72" width="72" color="#ffffff" />
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredCollections && filteredCollections.length > 0 ? (
              filteredCollections.map((item) => (
                <article key={item._id} className={styles.card}>
                  <div className={styles.mediaWrap}>
                    {/* Use unoptimized for external images or configure next.config.js */}
                    <Image
                        src={item.image}
                        alt={item.location}
                        fill
                        quality={90}
                        style={{ objectFit: "cover", objectPosition: "center" }}
                      />


                    <div className={styles.cardOverlay} />
                    <div className={styles.cardMeta}>
                      {/* <div className={styles.smallLabel}>DESERT-BORN MINDFULNESS</div> */}
                      <h3 className={styles.location}>{item.location}</h3>
                      <p className={styles.description}>{item.description}</p>
                    </div>

                    <Link href={`/location/${item.location}`} className={styles.cardArrow} aria-label={`Details for ${item.location}`}>
                      <span>›</span>
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className={styles.empty}>No locations found.</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

