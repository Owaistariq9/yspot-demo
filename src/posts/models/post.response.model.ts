import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

export const ResponseSchema = new Schema(
{
    postId:String,
    userId:String,
    postType:String,
    data: {}
},{ timestamps: true })

export interface Response extends mongoose.Document {
    postId:String,
    userId:String,
    postType:String,
    data: {}
}