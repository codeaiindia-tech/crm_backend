import { dbConnect } from "@/db/dbConnect";
import Call from "@/models/call.models";
import { getDataToken } from "@/utils/getDataToken";
import { NextRequest, NextResponse } from "next/server";


export async function GET( request : NextRequest ){

    const userId = await getDataToken(request)

    if(!userId){
        return NextResponse.json({
            status: false,
            message: "Unauthorized Request"
        }, { status: 400 })
    }

    try {
        
        await dbConnect();

        const rejectedOutgoingCall = await Call.find( 
            {
                callType: "OUTGOING",
                callStatus: "REJECTED"
            }
         ).sort({ createdAt: -1 })

         if(!rejectedOutgoingCall){
            return NextResponse.json({
                status: false,
                message: "Unable to fetch Missed Incoming Calls"
            }, { status: 402 })
         }

        return NextResponse.json({
            status: true,
            message: "Missed Outgoing Calls fetched successfully",
            data: rejectedOutgoingCall
        }, { status: 200 })

    } catch (error:any) {
        return NextResponse.json({
            status: false,
            message: "Internal Server Error",
            error: error.message
        }, { status: 500 })
    }

}
