import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"


export const getDataToken = async ( request : NextRequest ) => {
    try {
        const token = request.cookies.get("token")?.value
        const secretToken = process.env.TOKEN_SECRET!

        if(!token && !secretToken){
            return NextResponse.json({
                status: false,
                message: "Unauthorized access",
                error: "Missing token or secret token"
            }, { status: 401 })
        }

        const decodedToken : any = jwt.verify( token!, secretToken )

        return decodedToken.id;

    } catch (error:any) {
        return NextResponse.json({
            success: false,
            message: "Error while fetching the token"
        }, {status: 500})
    }
} 