// import Image from "next/image";
// import styles from "./resort.module.css";

// export default function ResortPage() {
//   const hotels = [
//     {
//       image: "/resort-1.webp",
//       title: "OceanView Resort",
//       location: "Goa, India",
//       description: "A peaceful beachside resort with luxury rooms."
//     },
//     {
//       image: "",
//       title: "Mountain Escape",
//       location: "Manali, India",
//       description: "Beautiful mountain views and cozy wooden cottages."
//     },
//     {
//       image: "",
//       title: "Royal Palace Stay",
//       location: "Jaipur, India",
//       description: "Experience royal heritage with premium amenities."
//     },
//     {
//       image: "",
//       title: "Green Valley Resort",
//       location: "Munnar, Kerala",
//       description: "Surrounded by tea gardens and misty mornings."
//     }
//   ];

//   return (
//     <div className={styles.resortSection}>
      
//       {hotels.map((hotel, i) => (
//         <div key={i} className={styles.card}>
//           <Image
//             src={hotel.image}
//             alt={hotel.title}
//             width={400}
//             height={250}
//             className={styles.cardImage}
//           />

//           <div className={styles.cardContent}>
//             <h2 className={styles.cardTitle}>{hotel.title}</h2>
//             <p className={styles.cardLocation}>{hotel.location}</p>
//             <p className={styles.cardDescription}>{hotel.description}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
