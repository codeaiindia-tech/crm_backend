import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { dbConnect } from "@/db/dbConnect";
import { Admin } from "@/models/admin.models";
import Call from "@/models/call.models";
import { getDataToken } from "@/utils/getDataToken";

type CallStatus = "CONNECTED" | "MISSED" | "REJECTED"

const result: Record<CallStatus, number> = {
  CONNECTED: 0,
  MISSED: 0,
  REJECTED: 0,
}


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


    const admin = await Admin.findById(new mongoose.Types.ObjectId(adminId)).select("employeesCreated");

    if (!admin) {
      return NextResponse.json(
        { status: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    const employeeIds = admin.employeesCreated;

    if (!employeeIds || employeeIds.length === 0) {
      return NextResponse.json({
        status: false,
        message: "Unable to fetch the employee"
      }, { status:400 });
    }


    const callStats = await Call.aggregate([
      {
        $match: {
          userId: {
            $in: employeeIds.map((id: mongoose.Types.ObjectId) => id),
          },
        },
      },
      {
        $group: {
          _id: "$callStatus",
          count: { $sum: 1 },
        },
      },
    ]);


    const result = {
      CONNECTED: 0,
      MISSED: 0,
      REJECTED: 0,
    };

    callStats.forEach((item: { _id: CallStatus; count: number }) => {
      result[item._id] = item.count;
    });

    return NextResponse.json({
      status: true,
      data: result,
    });


  } catch (error) {
    console.error("ADMIN CALL STATUS ERROR:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Unable to fetch call statistics",
      },
      { status: 500 }
    );
  }
}
