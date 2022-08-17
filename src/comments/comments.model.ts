import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

export const CommentSchema = new Schema(
{
    postId:String,
    comment: [{
        userId: String,
        userName: String,
        text: String,
        profilePicture: String,
        approved: {type: Boolean, default: false},
        createdOnDate: {type:Number , default: new Date().getTime()}
    }]
},{ timestamps: true })

export interface Comments extends mongoose.Document {
    postId:String,
    comment: [{
        userId:String,
        userName:String,
        text:String,
        profilePicture:String,
        approved:Boolean
    }]
}