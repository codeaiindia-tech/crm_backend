import { dbConnect } from "@/db/dbConnect";
import { Admin } from "@/models/admin.models";
import User from "@/models/employee.models";
import { getDataToken } from "@/utils/getDataToken";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request:NextRequest){

    const {adminId} = await getDataToken(request)

    if(!adminId){
        return NextResponse.json({
            status: false,
            message: "Unauthorized Access"
        }, { status: 400 })
    }

    try {
        
        await dbConnect();

        const adminProfile = await Admin.findById(new mongoose.Types.ObjectId(adminId))

        if(!adminProfile){
            return NextResponse.json({
                status: false,
                message: "Unable to fetch the Admin Profile"
            }, { status: 400 })
        }

        return NextResponse.json({
            status: true,
            message: "Admin profile fetched successfully",
            data: adminProfile
        }, { status: 200 })

    } catch (error:any) {
        return NextResponse.json({
            status: false,
            message: "Internal Server Error",
            error: error.message
        }, { status: 500 })
    }

}
