import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export const getDataToken = async (request: NextRequest) => {
  const aToken = request.cookies.get("adminToken")?.value;
  const eToken = request.cookies.get("employeeToken")?.value;

  // if (!aToken) {
  //   throw new Error("Admin token missing");
  // }

  let adminId: string | null = null;
  let employeeId: string | null = null;

  if (aToken) {
    const decoded = jwt.verify(aToken, process.env.TOKEN_SECRET!) as JwtPayload;

    adminId = decoded.id;
  }

  if (eToken) {
    const decoded = jwt.verify(eToken, process.env.TOKEN_SECRET!) as JwtPayload;

    employeeId = decoded.id;
  }

  return { adminId, employeeId };
};
