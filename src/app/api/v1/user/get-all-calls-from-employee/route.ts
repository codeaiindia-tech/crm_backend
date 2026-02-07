import { dbConnect } from "@/db/dbConnect";
import { Admin } from "@/models/admin.models";
import Call from "@/models/call.models";
import { getDataToken } from "@/utils/getDataToken";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

type empId = string | null

export async function GET(request:NextRequest){

    // const {empId} = await request.json()

    const {searchParams} = new URL(request.url)
    const empId : empId = searchParams.get("uId")

    const { adminId } = await getDataToken(request)

    if(!adminId){
        return NextResponse.json({
            status: false,
            message: "Unauthorized Request"
        }, { status:401 })
    }

    if(!empId){
        return NextResponse.json({
            status: false,
            message: "Employee Id is missing"
        }, { status:401 })
    }

    try {
        await dbConnect();

        const admin = await Admin.findById(new mongoose.Types.ObjectId(adminId))

        if(!admin){
            return NextResponse.json({
                status: false,
                message: "Unable to fetch Admin"
            }, { status:400 })
        }

        const calls = await Call.find({ empId: new mongoose.Types.ObjectId(empId) }).sort({ createdAt: -1 })

        if(!calls){
            return NextResponse.json({
                status: false,
                message: "Can't find the call logs"
            }, { status:400 })
        }

        return NextResponse.json({
            status: true,
            message: `Call log found for ${empId}`,
            data: calls
        }, { status:200 })



    } catch (error:any) {
        console.log("Error while fetching calls from employee", error)
        return NextResponse.json({
            status: false,
            message: "Internal Server Error",
            error: error.message
        }, { status:500 })
    }

}
