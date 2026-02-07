import { dbConnect } from "@/db/dbConnect";
import { Admin } from "@/models/admin.models";
import User from "@/models/employee.models";
import { getDataToken } from "@/utils/getDataToken";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";


export async function POST( request : NextRequest ){

    const {adminId} = await getDataToken(request)

    if(!adminId){
        return NextResponse.json({
            status: false,
            message: "Unauthorized Request"
        }, {status: 401})
    }

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
                message: "Admin does not exist, please Register"
            }, { status: 401 } )
        }

        const newHashedPassword = await bcrypt.hash(confirmNewPassword, 10)

        const updatedAdminPassword = await User.findByIdAndUpdate( existingUser._id ,
            {
                password: newHashedPassword
            },
            {
                new: true
            }
        )

        if(!updatedAdminPassword){
            return NextResponse.json( {
                status: false,
                message: "Error while changing the password"
            }, { status: 402 } )
        }

        // const updatedAdmin = await Admin.findByIdAndUpdate()

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
