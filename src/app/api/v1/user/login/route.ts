import { dbConnect } from "@/db/dbConnect";
import User from "@/models/user.models";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  const { identifier, password } = await request.json();

  if (!identifier || !password) {
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

    const user = await User.findOne({
      $or: [{ email: identifier }, { phoneNumber: identifier }],
    });

    if (!user) {
      return NextResponse.json(
        {
          status: false,
          message: "User not registered, Please register!",
          alert: "alert"
        },
        { status: 401 }
      );
    }

    const passwordIsValid = await bcryptjs.compare( password, user.password )

    if(!passwordIsValid){
        return NextResponse.json({
            status: false,
            message: "Invalid Password",
            alert: "warning"
        }, { status: 401 })
    }

    const token = jwt.sign( 
        {
            id: user._id,
        },
        process.env.TOKEN_SECRET!,
        {
            expiresIn: "1d"
        }
        
     )

    const response = NextResponse.json( {
        status: true,
        message: "User logged in successfully"
    }, { status: 200 } )

    response.cookies.set("token", token)

    return response;

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
