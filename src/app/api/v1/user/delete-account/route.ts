import { dbConnect } from "@/db/dbConnect";
import User from "@/models/user.models";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";


export async function GET( request : NextRequest ){
    
    const { searchParams } = new URL(request.url)
    const empId = searchParams.get("id")

    if(!empId){
        return NextResponse.json( {
            status: false,
            message: "Employee Id is missing"
        }, { status: 401 } )
    }

    try {
        await dbConnect();

        // const existingUser = await User.findById()
        
        const deleteExistingUser = await User.findByIdAndDelete(empId)

        if(!deleteExistingUser){
            return NextResponse.json( {
                status: false,
                message: "Error while deleting user"
            }, { status: 402 } )
        }

        return NextResponse.json({
            status: true,
            message: "Employee deleted successfully"
        }, { status: 200 })

    } catch (error : any) {
        return NextResponse.json( {
            status: false,
            message: "Internal Server Error",
            error: error.message
        }, { status: 500 } )
    }

}