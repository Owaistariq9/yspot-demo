import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

export const UserResponseSchema = new Schema(
{
    _id: String,
    // userId:{ type:String, unique:true, required:true },
    responseIds:[]
},{ timestamps: true})

export interface UserResponse extends mongoose.Document {
    userId:String,
    responseIds: []
}