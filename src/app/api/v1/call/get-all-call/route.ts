import { dbConnect } from "@/db/dbConnect";
import { Admin } from "@/models/admin.models";
import { getDataToken } from "@/utils/getDataToken";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request:NextRequest){
    const {adminId} = await getDataToken(request)

    if(!adminId){
        return NextResponse.json({
            status: false,
            message: "Unauthorized Request"
        }, { status:401 })
    }

    try {
        await dbConnect();

        const admin = await Admin.findById(adminId).select("employeesCreated")

        if(!admin){
            return NextResponse.json({
                status: false,
                message: "Unable to find the Admin"
            }, { status:400 })
        }

        if(admin.employeesCreated.length === 0){
            return NextResponse.json({
                status: false,
                message: "No employees under this admin",
                totalCalls: 0,
                
            }, { status:400 })
        }



    } catch (error:any) {
        return NextResponse.json({
            status: false,
            message: "Internal server Error",
            error: error.message
        }, { status:500 })
    }

}
