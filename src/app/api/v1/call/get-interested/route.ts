import { dbConnect } from "@/db/dbConnect";
import Call from "@/models/call.models";
import { getDataToken } from "@/utils/getDataToken";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest){

    const userId = await getDataToken(request)

    if(!userId){
        return NextResponse.json({
            status: false,
            message: "Unauthorized Request"
        }, { status: 401 })
    }

    try {

        await dbConnect();

        const interested = await Call.find({ interested: true }).sort({createdAt: -1})

        if(!interested){
            return NextResponse.json({
                status: false,
                message: "Unable to fetch Interested Lead"
            }, { status: 400 })
        }

        return NextResponse.json({ 
            status: true,
            message: "Intereted Lead fetched successfully",
            totalResult: interested.length,
            data: interested
         }, { status:200 })
        
    } catch (error:any) {
        return NextResponse.json({
            status: false,
            message: "Internal Server Error",
            error: error.message
        }, { status: 500 })
    }

}

