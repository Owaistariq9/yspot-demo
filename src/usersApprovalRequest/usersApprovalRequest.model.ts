import * as mongoose from "mongoose";
import { Constants } from "src/core/constants/constants";
const Schema = mongoose.Schema;

export const UsersApprovalRequestSchema = new Schema(
    {
        userId: String,
        status: String,
        email: String,
        fullName: String,
        profilePicture:String,
        createdOnDate: {type:Number , default: new Date().getTime()},
        userType: {type:String , default: Constants.user}  
    }
)

export interface UsersApprovalRequest extends mongoose.Document {
    userId: String,
    status: String,
    email: String,
    fullName: String,
    profilePicture:String,
    createdOnDate: Number,
    userType: String,
}