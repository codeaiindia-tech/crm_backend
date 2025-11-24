import mongoose from "mongoose";
import { callSchema, ICall } from "./call.models";

export interface IUser {
  name: string;
  email: string;
  phoneNumber: string;
  dateOfJoining: Date;
  role: string;
  password: string;
  callDetails: ICall[]
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: String,
      require: true,
    },
    dateOfJoining: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ["Employee", "Admin"],
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    callDetails: [ callSchema ]
  },
  { timestamps: true }
);

const User = mongoose.models?.User || mongoose.model<IUser>("User", userSchema);

export default User;
