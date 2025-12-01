import mongoose from "mongoose";
import { callSchema, ICall } from "./call.models";

export interface IUser {
  name: string;
  email: string;
  phoneNumber: string;
  dateOfJoining: Date;
  role: string;
  password: string;
  dateOfBirth: Date;
  callDetails: ICall[]
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    dateOfJoining: {
      type: Date,
      default: Date.now,
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    role: {
      type: String,
      default: "Employee"
      // enum: ["Employee", "Admin"],
      // require: true,
    },
    password: {
      type: String,
      required: true,
    },
    // callDetails: [ callSchema ]
  },
  { timestamps: true }
);

const User = mongoose.models?.User || mongoose.model<IUser>("User", userSchema);

export default User;
