import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

export const NotificationSchema = new Schema(
{
    userId:Schema.Types.ObjectId,
    notificationTokens:[{        
        deviceId: String,
        device: String,}]  
},{ timestamps: true }
)

export interface Notification extends mongoose.Document {
    userId: String
    notificationTokens:[{        
        deviceId: String,
        device: String,}]     
}