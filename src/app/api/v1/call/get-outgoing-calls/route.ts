import { getDataToken } from "@/utils/getDataToken";
import { dbConnect } from "@/db/dbConnect";
import Call from "@/models/call.models";
import { NextRequest, NextResponse } from "next/server";

// route for INCOMING CALLS ONLY
export async function GET( request : NextRequest ){
    
    const userId = await getDataToken(request)

    if(!userId){
        return NextResponse.json({
            status: false,
            message: "Unauthorized request"
        }, { status: 401 })
    }

    try {
        await dbConnect();

        const allOutgoingCalls = await Call.find({ callType: "OUTGOING" }).sort({ createdAt: -1 })

        if(!allOutgoingCalls){
            return NextResponse.json({
                status: false,
                message: "Unable to fetch OUTGOING CALLS"
            }, { status: 400 })
        }

        return NextResponse.json({
            status: true,
            message: "Outgoing calls fetched successfully",
            data: allOutgoingCalls 
        }, { status: 200 })

    } catch (error:any) {
        return NextResponse.json({
            status: false,
            message: "Internal Server Error",
            error: error.message
        }, { status: 500 })
    }

}
