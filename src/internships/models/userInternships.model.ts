import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

export const UserInternshipsSchema = new Schema(
{
    internshipId: String,
    userId: String,
    businessId: String,
    feedback: {
        ability: Number,
        contribution: Number,
        responsiveness: Number,
        creativity: Number,
        adaptability: Number,
        initiative: Number,
        integrity: Number,
        totalRating: Number,
        avgRating: Number
    }
},{ timestamps: true })

export interface UserInternships extends mongoose.Document {
    internshipId:String,
    userId:String,
    businessId:String,
    feedback: {
        ability: Number,
        contribution: Number,
        responsiveness: Number,
        creativity: Number,
        adaptability: Number,
        initiative: Number,
        integrity: Number,
        totalRating: Number,
        avgRating: Number
    }
}