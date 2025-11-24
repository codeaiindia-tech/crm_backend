import { getDataToken } from "@/app/utils/getDataToken";
import { dbConnect } from "@/db/dbConnect";
import Call from "@/models/call.models";
import User from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const {
    leadName,
    leadPhoneNumber,
    callType,
    callStatus,
    interested,
    notes,
  }: {
    leadName: String;
    leadPhoneNumber: string;
    callType: string;
    callStatus: string;
    interested: boolean;
    notes: string;
  } = await request.json();

  if (
    !leadName ||
    !leadPhoneNumber ||
    !callType ||
    !callStatus ||
    interested === undefined
  ) {
    return NextResponse.json(
      {
        status: false,
        message: "Either of the field is missing",
      },
      { status: 401 }
    );
  }

  const userId = await getDataToken(request)

//   const {searchParams} = new URL(request.url)
//   const userId = searchParams.get("id")

  try {
    await dbConnect();

    const newLeadDetail = await Call.create( {
        userId: userId,
        leadName: leadName,
        leadPhoneNumber: leadPhoneNumber,
        callType: callType,
        callStatus: callStatus,
        interested: interested,
        notes: notes
    } )

    if(!newLeadDetail){
        return NextResponse.json( { 
            status: false,
            message: "Error while uploading call details"
         }, {status:402} )
    }

    return NextResponse.json({
        status: true,
        message: "Call details uploaded successfully"
    }, { status: 200 })
    

  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
