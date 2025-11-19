import DBConnection from "@/app/utils/config/db";
import UserModel from "@/app/utils/models/User";
import { NextResponse } from "next/server";
export async function GET(request,{params}){
    await DBConnection();
    const {id}=await params;
    console.log("dynamic id:",id)
    try{
        if(!id){
            return NextResponse.json({success:false,message:'no user found'},{status:404})
        }
        const user = await UserModel.findById(id);
        return NextResponse.json({success:true,data:user})


    }catch(e){
        console.log(e);
        return NextResponse.json({success:false,message:'ID is missing'
        })

    }
}
