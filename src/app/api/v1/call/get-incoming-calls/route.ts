import { dbConnect } from "@/db/dbConnect"
import { Admin } from "@/models/admin.models"
import Call from "@/models/call.models"
import "@/models/employee.models"
import { getDataToken } from "@/utils/getDataToken"
import mongoose from "mongoose"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const {adminId} = await getDataToken(request)

    if (!adminId) {
      return NextResponse.json(
        { status: false, message: "Unauthorized Access" },
        { status: 401 }
      )
    }

    const admin = await Admin.findById(new mongoose.Types.ObjectId(adminId)).select("employeesCreated")

    if (!admin) {
      return NextResponse.json(
        { status: false, message: "Admin not found", totalIncomingCalls:0 },
        { status: 404 }
      )
    }

    if (admin.employeesCreated.length === 0) {
      return NextResponse.json(
        {
          status: false,
          message: "No employees under this admin",
          totalIncomingCalls: 0,
          data: []
        },
        { status: 200 }
      )
    }

    const incomingCalls = await Call.find({
      callType: "INCOMING",
      empId: { $in: admin.employeesCreated },
    })
      .populate("empId")
      .sort({ createdAt: -1 })

    return NextResponse.json(
      {
        status: true,
        message: "Incoming calls fetched successfully",
        totalIncomingCalls: incomingCalls.length,
        data: incomingCalls,
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error(error)
    return NextResponse.json(
      {
        status: false,
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    )
  }
}
