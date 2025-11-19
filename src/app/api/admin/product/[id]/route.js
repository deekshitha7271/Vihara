import DBConnection from "@/app/utils/config/db";
import ProductModel from "@/app/utils/models/Product";
import { NextResponse } from "next/server";
export async function GET(request,{params}){
    await DBConnection();
    const {id}=await params;
    console.log("dynamic id:",id)
    try{
        if(!id){
            return NextResponse.json({success:false,message:'no user found'},{status:404})
        }
        const product = await ProductModel.findById(id);
        return NextResponse.json({success:true,data:product})


    }catch(e){
        console.log(e);
        return NextResponse.json({success:false,message:'No product Found'
        })

    }
}
