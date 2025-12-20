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
          totalMissedCalls: 0
        },
        { status: 200 }
      );
    }

    const missedCalls = await Call.find({
      callStatus: "MISSED",
      empId: { $in: admin.employeesCreated },
    }).populate("empId name email phoneNumber").sort({ createdAt: -1 })

    return NextResponse.json({
        status: true,
        message: "All missed calls fetched successfully",
        totalMissedCalls: missedCalls.length,
        missedCalls
    }, { status:200 })

  } catch (error: any) {
    console.log("Error while fetching all missed calls", error);
    return NextResponse.json(
      {
        status: false,
        message: "Error while fetching missed calls",
      },
      { status: 500 }
    );
  }
}
