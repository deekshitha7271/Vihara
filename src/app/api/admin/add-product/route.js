import DBConnection from "@/app/utils/config/db";
import { NextResponse } from "next/server";
import {writeFile} from 'fs/promises';
import path from 'path';
import ProductModel from "@/app/utils/models/Product";
export async function GET(){
    await DBConnection();
    const records = await ProductModel.find({});
    return NextResponse.json({data:records})
}

export async function POST(request){
    await DBConnection();
    const data = await request.formData();
    const title=data.get('title');
    const price=data.get('price');
    const offer=data.get('offer');
    const amen=data.get('amen');
    const description=data.get('description');
    const image=data.get('image');

    const bufferData=await image.arrayBuffer();
    const buffer=Buffer.from(bufferData);
    const imagePath = path.join(process.cwd(),'public','uploads',image.name);
    try{
        await writeFile(imagePath,buffer);
        const newProduct = new ProductModel({
            title:title,
            price:price,
            offer:offer,
            amen:amen,
            description:description,
            image:`/uploads/${image.name}`


        })
        await newProduct.save();
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