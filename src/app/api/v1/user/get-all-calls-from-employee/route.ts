import { dbConnect } from "@/db/dbConnect";
import { getDataToken } from "@/utils/getDataToken";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request:NextRequest){
    const { adminId } = await getDataToken(request)

    if(!adminId){
        return NextResponse.json({
            status: false,
            message: "Unauthorized Request"
        }, { status:401 })
    }

    try {
        await dbConnect();

        

    } catch (error:any) {
        
    }

}
