import { dbConnect } from "@/db/dbConnect";
import User from "@/models/employee.models";
import { getDataToken } from "@/utils/getDataToken";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest){

    const { name, phoneNumber, email, newPassword } = await request.json()

    const {searchParams} = new URL(request.url)
    const uId = searchParams.get("uId")

    const userId = await getDataToken(request)

    if(!userId){
        return NextResponse.json({
            status: false,
            message: "Unauthorized access"
        }, { status: 401 })
    }

    try {

        await dbConnect();

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        const updatedEmployee = await User.findByIdAndUpdate(uId, { 
            name: name,
            phoneNumber: phoneNumber,
            email: email,
            password: hashedPassword
         }, { new: true })

         if(!updatedEmployee){
            return NextResponse.json({
                status: false,
                message: "Unable to update the user"
            }, { status: 400 })
         }
         
         return NextResponse.json({
            status: true,
            message: "Employee details updated successfully",
            data: updatedEmployee
         }, { status: 200 })
        
    } catch (error:any) {
        return NextResponse.json({
            status: false,
            message: "Internal Server Error",
            error: error.message
        }, { status:500 })
    }

}
