import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

export const FollowersSchema = new Schema(
{
    userId:String,
    followerId:String
},{ timestamps: true }
)

export interface Followers extends mongoose.Document {
    userId:String,
    followerId:String
}