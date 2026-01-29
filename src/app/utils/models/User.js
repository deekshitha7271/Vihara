import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'host', 'admin'],
        default: 'user'
    },

    hostProfile: {
        completed: {
            type: Boolean,
            default: false
        },
        joinedAt: {
            type: Date
        },
        allowedLocations: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "location"
        }
    },
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'booking'
    }]
}, { timestamps: true }
);

const UserModel = mongoose.models.user || mongoose.model('user', userSchema);
export default UserModel;