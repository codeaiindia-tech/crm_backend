import mongoose, { ObjectId } from "mongoose";

export interface ICall{
    empId: ObjectId,
    leadName: string,
    leadPhoneNumber: string,
    callType: string,
    callStatus: string,
    interested: boolean,
    notes: string
}

export const callSchema = new mongoose.Schema<ICall>({
    empId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    leadName: {
        type: String,
        required: true
    },
    leadPhoneNumber: {
        type: String,
        required: true
    },
    callType: {
        type: String,
        enum: [ "INCOMING", "OUTGOING" ],
        required: true
    },
    callStatus: {
        type: String,
        enum: [ "CONNECTED", "REJECTED", "MISSED" ],
        required: true
    },
    interested: {
        type: Boolean,
        required: true
    },
    notes: {
        type: String,
        default: "No Notes"
    },
}, { timestamps: true })

const Call = mongoose.models?.Call ||  mongoose.model<ICall>("Call", callSchema)

export default Call;