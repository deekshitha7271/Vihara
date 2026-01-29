import mongoose from 'mongoose';
const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    isFeatured: { type: Boolean, default: false },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING"
    },
    lat: { type: Number },
    lng: { type: Number }
}, { timestamps: true });

const HotelModel = mongoose.models.hotel || mongoose.model('hotel', hotelSchema);
export default HotelModel;
