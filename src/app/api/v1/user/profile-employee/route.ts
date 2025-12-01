import User from "@/models/employee.models";
import { getDataToken } from "@/utils/getDataToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const eId = searchParams.get("eid");

  if (!eId) {
    return NextResponse.json(
      {
        status: false,
        message: "Employee id not found",
      },
      { status: 401 }
    );
  }

  const userId = await getDataToken(request);

  if (!userId) {
    return NextResponse.json(
      {
        status: false,
        message: "Unauthorized Access",
      },
      { status: 401 }
    );
  }

  try {
    const employeeProfile = await User.findById(eId).select("-password");

    if (!employeeProfile) {
      return NextResponse.json(
        {
          status: false,
          message: "Unable to fetch Employee profile",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        status: true,
        message: "Employee fetched successfully",
        data: employeeProfile,
      },
      { status: 200 }
    );
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
