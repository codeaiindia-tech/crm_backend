import { dbConnect } from "@/db/dbConnect";
import { Admin } from "@/models/admin.models";
import Call from "@/models/call.models";
import { getDataToken } from "@/utils/getDataToken";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { adminId } = await getDataToken(request);

  if (!adminId) {
    return NextResponse.json(
      {
        status: false,
        message: "Unauthorized access",
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
        },
        { status: 400 }
      );
    }

    if (admin.employeesCreated.length === 0) {
      return NextResponse.json(
        {
          status: false,
          message: "No employees under this admin",
          totalConnectedCalls: 0
        },
        { status: 200 }
      );
    }

    const connectedCalls = await Call.find({
      callStatus: "CONNECTED",
      empId: { $in: admin.employeesCreated },
    }).populate("empId name email phoneNumber").sort({ createdAt: -1 })

    return NextResponse.json({
        status: true,
        message: "All rejected calls fetched successfully",
        totalConnectedCalls: connectedCalls.length,
        connectedCalls
    }, { status:200 })

  } catch (error: any) {
    console.log("Error while fetching all rejected calls", error);
    return NextResponse.json(
      {
        status: false,
        message: "Error while fetching rejected calls",
      },
      { status: 500 }
    );
  }
}
