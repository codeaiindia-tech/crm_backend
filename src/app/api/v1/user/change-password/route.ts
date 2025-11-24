import { dbConnect } from "@/db/dbConnect";
import User from "@/models/user.models";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";


export async function POST( request : NextRequest ){

    const { phoneNumber, newPassword, confirmNewPassword } = await request.json()

    if( !newPassword || !confirmNewPassword ){
        return NextResponse.json( {
            status: false,
            message: "Either of the field is missing"
        }, { status: 401 } )
    }

    if( newPassword !== confirmNewPassword ){
        return NextResponse.json( { 
            status: false,
            message: "Password does not match"
         }, { status: 402 } )
    }

    try {
        await dbConnect();

        const existingUser = await User.findOne( { phoneNumber } )

        if(!existingUser){
            return NextResponse.json( {
                status: false,
                message: "User does not exist, please Register"
            }, { status: 401 } )
        }

        const newHashedPassword = await bcrypt.hash(confirmNewPassword, 10)

        const updatedUserPassword = await User.findByIdAndUpdate( existingUser._id ,
            {
                password: newHashedPassword
            },
            {
                new: true
            }
        )

        if(!updatedUserPassword){
            return NextResponse.json( {
                status: false,
                message: "Error while changing the password"
            }, { status: 402 } )
        }

        return NextResponse.json({ 
            status: true,
            message: "Password changed successfully"
         }, { status: 200 })
        
    } catch (error : any) {
        console.log("Error")
        return NextResponse.json( {
            status: false,
            message: "Internal Server Error",
            error: error.message
        }, { status: 500 } )
    }

}
