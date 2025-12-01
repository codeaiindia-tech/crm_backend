import mongoose from "mongoose";

export interface IAdmin extends Document{
    name: string;
    phoneNumber: string;
    email: string;
    role: string
}

const adminSchema = new mongoose.Schema<IAdmin>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        role: {
            type: String,
            default: "Admin",
            enum: ["Admin"]
        }
    }, { timestamps: true })

export const Admin = mongoose.models?.Admin || mongoose.model("Admin", adminSchema)
