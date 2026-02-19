import mongoose from 'mongoose';
const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    category: { type: String, required: true },
    image: { type: String, required: true },
    images: { type: [String], default: [] },
    price: { type: Number, required: true },
    isFeatured: { type: Boolean, default: false },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING"
    },
    lat: { type: Number },
    lng: { type: Number },
    amenities: { type: [String], default: [] },
    facilities: {
        guests: { type: Number, default: 1 },
        bedrooms: { type: Number, default: 1 },
        bathrooms: { type: Number, default: 1 },
        beds: { type: Number, default: 1 }
    },
    checkInTime: { type: String, default: "14:00" },
    checkOutTime: { type: String, default: "11:00" },
    houseRules: { type: [String], default: [] }
}, { timestamps: true });

const HotelModel = mongoose.models.hotel || mongoose.model('hotel', hotelSchema);
export default HotelModel;
