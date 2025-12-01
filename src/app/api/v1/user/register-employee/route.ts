import { dbConnect } from "@/db/dbConnect";
import User from "@/models/employee.models";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { name, email, phoneNumber, dateOfBirth, password, confirmPassword } =
    await request.json();

  if (
    !name ||
    !email ||
    !phoneNumber ||
    !dateOfBirth ||
    !password ||
    !confirmPassword
  ) {
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
      { status: 400 }
    );
  }

  const hashedPassword = bcrypt.hash(password, 10);

  try {
    await dbConnect();

    const existingEmployee = await User.findOne({ phoneNumber, email });

    if (existingEmployee) {
      return NextResponse.json(
        {
          status: false,
          message: "Employee already exists",
        },
        { status: 400 }
      );
    }

    const newEmployee = await User.create({
      name,
      phoneNumber,
      email,
      dateOfBirth,
      password: hashedPassword,
    });

    if(!newEmployee){
        return NextResponse.json({
            status: false,
            message: "Error while registering the user"
        }, { status: 400 })
    }

    return NextResponse.json({
        status: false,
        message: "Employee registered successfully",
        data: newEmployee
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
