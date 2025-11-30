import { getDataToken } from "@/utils/getDataToken"
import { dbConnect } from "@/db/dbConnect"
import User from "@/models/user.models"
import { NextRequest, NextResponse } from "next/server"


export async function GET( request : NextRequest ){
    const userId = await getDataToken(request)

    if(!userId){
        return NextResponse.json({
            status: false,
            message: "Unauthorized access"
        }, { status: 401 })
    }

    try {

        await dbConnect();

        const user = await User.find().sort({ createdAt: -1 });

        if(!user){
            return NextResponse.json({
                status: false,
                message: "unable to fetch",
            }, { status: 400 })
        }

        return NextResponse.json({
            status: true,
            message: "All employees fetched successfully",
            data: user
        }, { status: 200 })
        
    } catch (error:any) {
        return NextResponse.json({
            status: false,
            message: "Internal Server Error",
            error: error.message
        }, { status: 500 })
    }

}
