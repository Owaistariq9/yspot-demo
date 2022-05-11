import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

export const LikeSchema = new Schema(
{
    postId:String,
    like: [{
        userId:String,
        userName:String,
        profilePicture:String,
        createdOnDate: {type:Number , default: new Date().getTime()}
    }]
},{ timestamps: true })

export interface Likes extends mongoose.Document {
    postId:String,
    like: [{
        userId:String,
        userName:String,
        profilePicture:String,
    }]
}