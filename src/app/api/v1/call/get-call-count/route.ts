import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { dbConnect } from "@/db/dbConnect";
import Call from "@/models/call.models";
import { getDataToken } from "@/utils/getDataToken";
import { Admin } from "@/models/admin.models";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { adminId } = await getDataToken(request);

    if (!adminId) {
      return NextResponse.json(
        { status: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const admin = await Admin.findById(
      new mongoose.Types.ObjectId(adminId)
    ).select("employeesCreated");

    if (!admin) {
      return NextResponse.json(
        { status: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    const employeeIds = admin.employeesCreated;

    if (employeeIds.length === 0) {
      return NextResponse.json({
        status: false,
        message: "No employees under this Admin",
        totalCalls: 0,
        data: [],
      });
    }

    const matchCondition: any = {
      empId: { $in: employeeIds },
    };

    const callCount = await Call.find(matchCondition);

    return NextResponse.json(
      {
        status: true,
        message: "All calls fetched successfully",
        totalCalls: callCount.length,
        data: callCount
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("ADMIN CALL STATS ERROR:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Unable to fetch call statistics",
      },
      { status: 500 }
    );
  }
}
