import { dbConnect } from "@/db/dbConnect";
import { Admin } from "@/models/admin.models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";



export async function POST( request:NextRequest ){

    const { identifier, password } = await request.json()

    if( !identifier || !password ){
        return NextResponse.json({
            status: false,
            message: "Either of the field is missing"
        }, { status:401 })
    }

    try {
        
        await dbConnect();

        const existingAdmin = await Admin.findOne(
            {
                $or: [ 
                    { email: identifier },
                    { phoneNumber: identifier }
                 ]
            }
        )

        if(!existingAdmin){
            return NextResponse.json({
                status: false,
                message: "Admin does not exists"
            }, { status:400 })
        }

        const passwordVerification = await bcrypt.compare(password, existingAdmin.password)

        if(!passwordVerification){
            return NextResponse.json({
                status: false,
                message: "Incorrect Password"
            }, { status: 400 })
        }

        const token = jwt.sign(
            {
            id: existingAdmin._id,
            role: existingAdmin.role
            },
            process.env.TOKEN_SECRET!, 
            {
                expiresIn: "1d"
            });


        const response = NextResponse.json({
            status: true,
            message: "Admin logged in successfully"
        }, { status:200 })

        response.cookies.set("token", token, { secure:true, httpOnly: true })

        return response;

    } catch (error:any) {
        return NextResponse.json({
            status: false,
            message: "Internal Server Error",
            error: error.message
        }, { status:500 })
    }

}
