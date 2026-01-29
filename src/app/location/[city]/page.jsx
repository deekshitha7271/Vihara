import DBConnection from "@/app/utils/config/db";
import HotelModel from '@/app/utils/models/hotel';
import LocationClient from "./LocationClient";

const LocationPage = async ({ params }) => {

    const { city } = await params;
    const decodeCity = decodeURIComponent(city);
    console.log("PARAMS 👉", params);
    await DBConnection();

    //to get only approved hotels for the city
    const hotels = await HotelModel.find({
        location: city,
        status: "APPROVED"
    });

    // Serialize to plain objects to pass to client component
    const serializedHotels = hotels.map(hotel => ({
        _id: hotel._id.toString(),
        name: hotel.name,
        image: hotel.image,
        description: hotel.description,
        price: hotel.price,
        location: hotel.location,
        category: hotel.category,
        lat: hotel.lat,
        lng: hotel.lng
    }));

    return (
        <LocationClient city={decodeCity} hotels={serializedHotels} />
    )
}

export default LocationPage;