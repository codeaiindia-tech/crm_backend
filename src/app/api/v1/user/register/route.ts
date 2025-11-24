import { dbConnect } from "@/db/dbConnect";
import User from "@/models/user.models";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { name, email, dateOfJoining, phoneNumber, role, password } =
    await request.json();

  if (!name || !email || !dateOfJoining || !phoneNumber || !role || !password) {
    return NextResponse.json(
      {
        status: false,
        message: "Either of the field is missing",
      },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const existingUser = await User.findOne({ phoneNumber: phoneNumber });

    if (existingUser) {
      return NextResponse.json(
        {
          status: false,
          message: "User Exists with this phone number, please Login",
          alert: "alert",
        },
        { status: 402 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      name,
      email,
      dateOfJoining,
      phoneNumber,
      role,
      password : hashedPassword
    });

    if(!newUser){
        return NextResponse.json( {
            status: false,
            message: "Error while register the user"
        }, { status: 401 } )
    }

    return NextResponse.json( {
        status: true,
        message: "User registered successfully",
        user: newUser
    }, { status: 200 } )

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
