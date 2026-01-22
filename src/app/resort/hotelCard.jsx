import Image from "next/image";
function HotelCard({ image, title, location, description }) {
  return (
    <div className="shadow-md rounded-lg overflow-hidden w-full max-w-sm">
      <Image
        src={image}
        alt={title}
        width={400}
        height={250}
        className="w-full h-48 object-cover"
      />

      <div className="p-3">
        <h2 className="font-semibold text-lg">{title}</h2>
        <p className="text-sm text-gray-600">{location}</p>
        <p className="text-sm mt-1">{description}</p>
      </div>
    </div>
  );
}
