const { default: mongoose } = require("mongoose");
const { type } = require("os");

const locationSchema = new mongoose.Schema({
    image:{
        type:String,
    },
    location:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    }
})

const LocationModel = mongoose.models.location || mongoose.model('location', locationSchema);

export default LocationModel;