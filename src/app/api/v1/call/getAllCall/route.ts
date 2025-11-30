import { getDataToken } from "@/utils/getDataToken";
import { dbConnect } from "@/db/dbConnect";
import Call from "@/models/call.models";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request:NextRequest){

    const userId = await getDataToken(request)

    if(!userId){
        return NextResponse.json({
            status: false,
            message: "Unauthorized request"
        }, { status: 401 })
    }

    try {
        await dbConnect();

        const allCalls = await Call.find().sort({ createdAt: -1 })

        if(!allCalls){
            return NextResponse.json({
                status: false,
                message: "Unable to fetch call logs"
            }, { status: 400 })
        }

        return NextResponse.json({
            status: true,
            message: "All call log fetched successfully",
            callLog: allCalls
        }, { status: 200 })

    } catch (error:any) {
        return NextResponse.json({
            status: false,
            message: "Internal Server Error",
            error: error.message
        }, { status: 500 })
    }
}
