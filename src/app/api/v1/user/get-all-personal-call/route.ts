import { dbConnect } from "@/db/dbConnect"
import Call from "@/models/call.models"
import User from "@/models/employee.models"
import mongoose from "mongoose"
import { NextRequest, NextResponse } from "next/server"



export async function GET(request:NextRequest){ 

    // const { userId, role } = await request.json()

    // if(!userId || role == "Admin"){
    //     return NextResponse.json({
    //         status: false,
    //         message: "Unauthorized Request/Access"
    //     }, { status: 401 })
    // }


    // for mobile authentication --->

    // const authHeader = request.headers.get("Authorization");
    // if (!authHeader) {
    //   return NextResponse.json(
    //     { status: false, message: "Missing Authorization header" },
    //     { status: 401 }
    //   );
    // }

    const {searchParams} = new URL(request.url)
    const empId = searchParams.get("uId")

    if(!empId){
        return NextResponse.json({
            status: false,
            message: "Employee Id missing"
        }, { status:401 })
    }

    try {
        
        await dbConnect();

        const employee = await User.findById(new mongoose.Types.ObjectId(empId))

        if(!employee){
            return NextResponse.json({
                status: false,
                message: "No such Employee exists"
            }, { status:400 })
        }

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
                employee: employee.name,
                total: callList.length,
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
