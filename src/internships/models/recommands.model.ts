import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

export const RecommandsSchema = new Schema(
{
    internshipId:String,
    recommandedBy:String,
    recommandedTo:String,
},{ timestamps: true })

export interface Recommands extends mongoose.Document {
    internshipId:String,
    recommandedBy:String,
    recommandedTo:String
}