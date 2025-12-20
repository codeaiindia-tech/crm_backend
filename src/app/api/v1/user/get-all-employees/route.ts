import { dbConnect } from "@/db/dbConnect";
import { Admin } from "@/models/admin.models";
import User from "@/models/employee.models";
import { getDataToken } from "@/utils/getDataToken";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";



export async function GET( request : NextRequest ){

    const {adminId} = await getDataToken(request)

    if(!adminId){
        return NextResponse.json({
            status: false,
            message: "Unauthorized Request"
        }, { status: 401 })
    }

    try {
        await dbConnect();

        // const admin = await Admin.findById(new mongoose.Types.ObjectId(adminId))

        // if(!admin){
        //     return NextResponse.json({
        //         status: false,
        //         message: "Unable to find Admin"
        //     }, { status: 400 })
        // }

        // if(admin.employeesCreated.length === 0){
        //     return NextResponse.json({
        //         status: false,
        //         message: "No employees under this admin"
        //     }, { status: 200 })
        // }

        const employees = await User.find( { adminId: new mongoose.Types.ObjectId(adminId) } )

        if(!employees){
            return NextResponse.json({
                status: false,
                message: "No employees under this admin"
            }, { status: 400 })
        }

        return NextResponse.json({
            status: true,
            message: "Employees fetched successfully",
            data: employees
        }, { status:200 })

    } catch (error:any) {
        return NextResponse.json({
            status: false,
            message: "Internal Server Error",
            error: error.message
        }, { status:500 })
    }

}
