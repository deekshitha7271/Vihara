import DBConnection from "@/app/utils/config/db";
import HostApplication from "@/app/utils/models/HostApplication";
import { auth } from "@/app/auth";
import { NextResponse } from "next/server";

export async function POST(request){
    await DBConnection();
    const session =await auth();

    if(session?.user.role !== 'admin'){
        return NextResponse.json({success:false, message:"Unauthorized"},{status:403});
    }

    const {applicationId} = await request.json();

    await HostApplication.findByIdAndUpdate(applicationId,{
        status:'REJECTED'
    })

    return NextResponse.json({success:true});
}