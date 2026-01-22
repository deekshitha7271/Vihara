import mongoose from 'mongoose';

const hostApplicationScehma = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
        unique:true
    },

    propertyType:String,
    city:String,
    propertyName:String,
    description:String,
    status:{
        type:String,
        enum:['PENDING','APPROVED','REJECTED'],
        default:'PENDING'
    },
    submittedAt:{
        type:Date,
        default:Date.now
    }

});

export default mongoose.models.hostApplication || mongoose.model('hostApplication', hostApplicationScehma);