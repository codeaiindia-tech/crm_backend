import { dbConnect } from "@/db/dbConnect";
import { Admin } from "@/models/admin.models";
import Call from "@/models/call.models";
import { getDataToken } from "@/utils/getDataToken";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import "@/models/employee.models"

export async function GET(request: NextRequest) {
  const { adminId } = await getDataToken(request);

  if (!adminId) {
    return NextResponse.json(
      {
        status: false,
        message: "Unauthorized Request",
      },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const admin = await Admin.findById(
      new mongoose.Types.ObjectId(adminId)
    ).select("employeesCreated");

    if (!admin) {
      return NextResponse.json(
        {
          status: false,
          message: "Unable to fetch admin",
          totalOutgoingCalls: 0,
        },
        { status: 400 }
      );
    }

    if (admin.employeesCreated.length === 0) {
      return NextResponse.json(
        {
          status: false,
          message: "No employees under Admin",
          totalOutgoingCall: 0,
          data: []
        },
        { status: 200 }
      );
    }

    const outgoingCalls = await Call.find({
      callType: "OUTGOING",
      empId: { $in: admin.employeesCreated },
    })
      .populate("empId")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        status: true,
        message: "Outgoing calls fetched successfully",
        totalOutgoingCall: outgoingCalls.length,
        data: outgoingCalls,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
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
