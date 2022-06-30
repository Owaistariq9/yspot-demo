import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

export const UserNotificationSchema = new Schema(
{
    userId: String,
    title: String,
    message: String,
    icon: {type: String, default: ""},
    data: {}
},{ timestamps: true }
)

export interface UserNotification extends mongoose.Document {
    userId: String,
    title: String,
    message: String,
    icon: String,
    data: {}
}