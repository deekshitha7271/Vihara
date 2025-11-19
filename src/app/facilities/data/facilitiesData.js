import { Waves, Leaf, Ship, Home, PersonStanding, Utensils } from "lucide-react";

export const facilitiesData = [
  {
    resort: "Palavelli Resorts",
    image: "/gallery-1.4.jpg",
    facilities: [
      {
        title: "Infinity Pool",
        desc: "Swim under the stars with a breathtaking lake view.",
        icon: (
          <Waves
            className="text-cyan-400 drop-shadow-[0_0_15px_#00ffff] hover:scale-110 transition-all duration-500"
            size={60}
            strokeWidth={1.8}
          />
        ),
      },
      {
        title: "Ayurvedic Spa",
        desc: "Authentic herbal treatments by trained therapists.",
        icon: (
          <Leaf
            className="text-green-400 drop-shadow-[0_0_15px_#00ff9d] hover:scale-110 transition-all duration-500"
            size={60}
            strokeWidth={1.8}
          />
        ),
      },
      {
        title: "Private Boating",
        desc: "Cruise through serene backwaters in luxury boats.",
        icon: (
          <Ship
            className="text-blue-400 drop-shadow-[0_0_15px_#00bfff] hover:scale-110 transition-all duration-500"
            size={60}
            strokeWidth={1.8}
          />
        ),
      },
    ],
  },
  {
    resort: "Dindi Resorts",
    image: "/gallery-2.4.jpg",
    facilities: [
      {
        title: "Riverfront Cottages",
        desc: "Wake up to sunrise over the Godavari river.",
        icon: (
          <Home
            className="text-yellow-400 drop-shadow-[0_0_15px_#ffd700] hover:scale-110 transition-all duration-500"
            size={60}
            strokeWidth={1.8}
          />
        ),
      },
      {
        title: "Yoga Pavilion",
        desc: "Morning sessions guided by certified instructors.",
        icon: (
          <PersonStanding
            className="text-pink-400 drop-shadow-[0_0_15px_#ff69b4] hover:scale-110 transition-all duration-500"
            size={60}
            strokeWidth={1.8}
          />
        ),
      },
      {
        title: "Organic Dining",
        desc: "Farm-to-table cuisine using local ingredients.",
        icon: (
          <Utensils
            className="text-lime-400 drop-shadow-[0_0_15px_#7fff00] hover:scale-110 transition-all duration-500"
            size={60}
            strokeWidth={1.8}
          />
        ),
      },
    ],
  },
];
