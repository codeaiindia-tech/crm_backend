import { dbConnect } from "@/db/dbConnect";
import { Admin } from "@/models/admin.models";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { name, phoneNumber, email, password, confirmPassword } =
    await request.json();

  if (!name || !phoneNumber || !email || !password || !confirmPassword) {
    return NextResponse.json(
      {
        status: false,
        message: "Either of the field is missing",
      },
      { status: 401 }
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      {
        status: false,
        message: "Password does not match",
      },
      { status: 401 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await dbConnect();

    const existingAdmin = await Admin.findOne({ phoneNumber });

    if (existingAdmin) {
      return NextResponse.json(
        {
          status: false,
          message: "User already registered!",
        },
        { status: 400 }
      );
    }

    const newAdmin = await Admin.create({
      name,
      phoneNumber,
      email,
      password: hashedPassword,
    });

    if (!newAdmin) {
      return NextResponse.json(
        {
          status: false,
          message: "Error while registering the user",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { status: true, message: "User registered successfully" },
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
