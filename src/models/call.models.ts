import mongoose, { ObjectId } from "mongoose";

export interface ICall{
    userId: ObjectId,
    leadName: string,
    leadPhoneNumber: string,
    callType: string,
    callStatus: string,
    interested: boolean,
    notes: string
}

export const callSchema = new mongoose.Schema<ICall>({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        require: true
    },
    leadName: {
        type: String,
        require: true
    },
    leadPhoneNumber: {
        type: String,
        require: true
    },
    callType: {
        type: String,
        enum: [ "INCOMING", "OUTGOING" ],
        require: true
    },
    callStatus: {
        type: String,
        enum: [ "CONNECTED", "REJECTED", "MISSED" ],
        require: true
    },
    interested: {
        type: Boolean,
        require: true
    },
    notes: {
        type: String,
        default: "No Notes"
    },
}, { timestamps: true })

const Call = mongoose.models?.Call ||  mongoose.model<ICall>("Call", callSchema)

export default Call;