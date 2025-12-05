import { dbConnect } from "@/db/dbConnect"
import Call from "@/models/call.models"
import { NextRequest, NextResponse } from "next/server"



export async function GET(request:NextRequest){ 

    // const { userId, role } = await request.json()

    // if(!userId || role == "Admin"){
    //     return NextResponse.json({
    //         status: false,
    //         message: "Unauthorized Request/Access"
    //     }, { status: 401 })
    // }

    const {searchParams} = new URL(request.url)
    const empId = searchParams.get("eid")

    if(!empId){
        return NextResponse.json({
            status: false,
            message: "Employee Id missing"
        }, { status:401 })
    }

    try {
        
        await dbConnect();

        const callList = await Call.find( { empId: empId } ).sort({ createdAt: -1 })

        if(callList.length == undefined){
            return NextResponse.json({
                status: false,
                message: "Unable to fetch the call list"
            }, { status: 400 })
        }

        return NextResponse.json({
            status: true,
            message: "Call list fetched successfully",
            data: {
                user: empId,
                callList: callList
            }
        }, { status:200 })

    } catch (error:any) {
        return NextResponse.json({
            status: false,
            message: "Internal Server Error",
            error: error.message
        }, { status:500 })
    }

 }
