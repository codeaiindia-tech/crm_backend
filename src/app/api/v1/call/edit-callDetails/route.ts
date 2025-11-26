import { getDataToken } from "@/app/utils/getDataToken";
import { dbConnect } from "@/db/dbConnect";
import Call from "@/models/call.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get("leadId");
  const { leadName, leadPhoneNumber, interested } = await request.json();

  if (!leadName || !leadPhoneNumber || !interested) {
    return NextResponse.json(
      {
        status: false,
        message: "Either of the field is missing",
      },
      { status: 401 }
    );
  }

  const userId = await getDataToken(request);

  if (!userId) {
    return NextResponse.json(
      {
        status: false,
        message: "Unauthorized access"
      },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const existingLead = await Call.findOne({ _id: leadId, userId: userId });

    if (!existingLead) {
      return NextResponse.json(
        {
          status: false,
          message: "No lead submitted by the user",
        },
        { status: 401 }
      );
    }

    const updatedLead = await Call.findByIdAndUpdate(
      existingLead._id,
      {
        leadName,
        leadPhoneNumber,
        interested,
      },
      { new: true }
    );

    if (!updatedLead) {
      return NextResponse.json(
        {
          status: false,
          message: "Error while updating lead details",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        status: true,
        message: "Lead details updated successfully",
        lead: updatedLead,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
