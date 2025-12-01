import { dbConnect } from "@/db/dbConnect";
import User from "@/models/employee.models";
import { getDataToken } from "@/utils/getDataToken";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request:NextRequest){

    const userId = await getDataToken(request)

    if(!userId){
        return NextResponse.json({
            status: false,
            message: "Unauthorized Access"
        }, { status: 400 })
    }

    try {
        
        await dbConnect();

        const adminProfile = await User.findById(userId)

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
