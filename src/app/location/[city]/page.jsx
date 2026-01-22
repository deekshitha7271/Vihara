import DBConnection from "@/app/utils/config/db";
import HotelModel from '@/app/utils/models/hotel';
import Link from "next/link";

const LocationPage = async ({params}) => {
    
    const {city} = await params;
    const decodeCity = decodeURIComponent(params.city);
    console.log("PARAMS 👉", params);
    await DBConnection();

    //to get only approved hotels for the city

    const hotels = await HotelModel.find({
        location: city,
        status: "APPROVED"
    });

    return (
        <div>
            <h1>Hotels in {city}</h1>

            {hotels.length === 0 && <p>No hotels found in {city}</p>}

            {hotels.map((hotel)=>(
                <Link key={hotel._id} href={`/detail/${hotel._id}`}>
                    <div>
                        <img src={hotel.image} width="300"/>
                        <h2>{hotel.name}</h2>
                        <p>{hotel.description}</p>
                        <p>Price: Rs.{hotel.price}</p>
                    </div>   
                </Link>
            ))}
        </div>
    )


}

export default LocationPage;