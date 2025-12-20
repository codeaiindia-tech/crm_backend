import { dbConnect } from "@/db/dbConnect";
import { Admin } from "@/models/admin.models";
import User from "@/models/employee.models";
import { getDataToken } from "@/utils/getDataToken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

  const {adminId} = await getDataToken(request);

  if (!adminId) {
    return NextResponse.json(
      {
        status: false,
        message: "Unauthorized Access",
      },
      { status: 401 }
    );
  }

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

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await dbConnect();

    const existingEmployee = await User.findOne({ 
      $or: [ { phoneNumber }, { email }  ]
     });

    if (existingEmployee) {
      return NextResponse.json(
        {
          status: false,
          message: "Employee already exists with this email or phone number.",
        },
        { status: 400 }
      );
    }

    const newEmployee = await User.create({
      adminId: adminId,
      name,
      phoneNumber,
      email,
      dateOfBirth,
      password: hashedPassword,
      role: "Employee"
    });

    // await Admin.employeesCreated.push(newEmployee)

    if (!newEmployee) {
      return NextResponse.json(
        {
          status: false,
          message: "Error while registering the user",
        },
        { status: 400 }
      );
    }

    const adminUpdated = await Admin.findByIdAndUpdate( new mongoose.Types.ObjectId(adminId) , 
        {
            $push:  { employeesCreated: newEmployee._id } 
        },
        {
            new: true
        }
    );

    if(!adminUpdated){
        return NextResponse.json({
            status: false,
            message: "Admin error while pushing the new employee"
        }, { status: 400 })
    }

    return NextResponse.json(
      {
        status: true,
        message: "Employee registered successfully",
        data: newEmployee,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error)
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
