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
import Loader from "./Loader";
import styles from "./LocationCollection.module.css";
import { motion } from "framer-motion";

import { getLocationsAction } from "@/app/serverActions/locationActions";

export default function LocationCollection() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    async function fetchCollections() {
      try {
        const res = await getLocationsAction();
        if (res.success) {
          setCollections(res.data || []);
        } else {
          console.error("Failed to fetch locations:", res.message);
        }
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
    { label: "All-Inclusive", value: "All-Inclusive" },
    { label: "Family", value: "Family" },
    { label: "Short Gateways", value: "Short Gateways" },

    { label: "Wellness", value: "Wellness" },


    { label: "All", value: "All" },

  ];

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredCollections = collections.filter((item) => {
    if (!item) return false;
    if (activeTab === "All") return true;
    const cat = (item.category || "").toString().trim().toLowerCase();
    return cat === activeTab.toString().trim().toLowerCase();
  });

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Calculate pagination
  const totalItems = filteredCollections.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedItems = filteredCollections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Optional: Scroll to top of grid
      // window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
                {t.value === activeTab && (
                  <motion.div
                    layoutId="activeTab"
                    className={styles.activeLine}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>
        </header>

        <div className={styles.underline} aria-hidden />

        {loading ? (
          <div className={styles.loaderWrap}>
            <Loader />
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {paginatedItems && paginatedItems.length > 0 ? (
                paginatedItems.map((item) => (
                  <article key={item._id} className={styles.card}>
                    <div className={styles.mediaWrap}>
                      <Image
                        src={item.image || '/bg-resort-2.jpeg'}
                        alt={item.location}
                        fill
                        quality={90}
                        className={styles.coverFullImg}
                        onError={(e) => {
                          e.currentTarget.srcset = "";
                          e.currentTarget.src = "/bg-resort-2.jpeg";
                        }}
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &lt; Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`${styles.pageBtn} ${currentPage === page ? styles.activePageBtn : ""}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className={styles.pageBtn}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next &gt;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

