import { getDataToken } from "@/app/utils/getDataToken";
import { dbConnect } from "@/db/dbConnect";
import Call from "@/models/call.models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest){
    const {searchParams} = new URL(request.url)
    const messageId = searchParams.get("mId")
    const userId = await getDataToken(request)

    if(!messageId){
        return NextResponse.json({
            status: false,
            message: "Message Id is missing"
        }, { status: 401 })
    }

    if(!userId){
        return NextResponse.json({
            status: false,
            message: "Token does not exist"
        }, { status: 401 })
    }

    try {

        await dbConnect()

        const deleteLead = await Call.findByIdAndDelete(messageId)

        if(!deleteLead){
            return NextResponse.json({
                status: false,
                message: "Error while deleting lead"
            }, { status:402 })
        }

        return NextResponse.json({ 
            status: false,
            message: "Lead deleted successfully"
         }, { status:200 })
        
    } catch (error:any) {
        return NextResponse.json({
            status: false,
            message: "Internal Server error",
            error: error.message
        }, { status: 500 })
    }

}