import mongoose from "mongoose";
const DBConnection = async()=>{
    try{
        console.log("Mongo URI:", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully");

    }
    catch(e){
        console.log(e)

    }
}

export default DBConnection;