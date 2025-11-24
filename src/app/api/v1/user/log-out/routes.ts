import { getDataToken } from "@/app/utils/getDataToken";
import { dbConnect } from "@/db/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET( request : NextRequest ){

    const userId = await getDataToken(request)

    if (!userId) {
      return Response.json(
        {
          success: false,
          message: "Token is required",
        },
        { status: 401 }
      );
    }

    try {
        await dbConnect();

        const response = NextResponse.json({
            status: true,
            message: "User logged out successfully"
        }, { status: 200 })

        response.cookies.set("token", "", { httpOnly: true, secure: true })

        return response;
        
    } catch (error:any) {
        return NextResponse.json({
            status: false,
            message: "Internal server error",
            error: error.message
        }, { status: 500 })
    }


}