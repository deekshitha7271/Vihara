import DBConnection from "@/app/utils/config/db";
import { NextResponse } from "next/server";
import {writeFile} from 'fs/promises';
import path from 'path';
import LocationModel from "@/app/utils/models/location";
export async function GET(){
    await DBConnection();
    const records = await LocationModel.find({});
    return NextResponse.json({data:records})
}

export async function POST(request){
    await DBConnection();
    const data = await request.formData();
    
    const image=data.get('image');
    const bufferData=await image.arrayBuffer();
    const buffer=Buffer.from(bufferData);
    const imagePath = path.join(process.cwd(),'public','uploads',image.name);
    const location = data.get('location');
    const description = data.get('description');
    const category = data.get('category');
    console.log(category)
    console.log(description)
    try{
        await writeFile(imagePath,buffer);
        const newLocation = new LocationModel({
            location:location,
            image:`/uploads/${image.name}`,
            description:description,
            category:category
        })
        await newLocation.save();
        return NextResponse.json({response:'Succesfully uploaded',success:true},
        {status:201}
        )
    }catch(e){
        console.log("Error in uploading image:",e);
        return NextResponse.json({response:'Error in uploading',success:false},
        {status:500}
        )
    }


    
}