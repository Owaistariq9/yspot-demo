import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

export const DemographicsSchema = new Schema(
{
    internshipId: String,
    age16To20Count: {type: Number, default: 0},
    age21To25Count: {type: Number, default: 0},
    maleCount: {type: Number, default: 0},
    femaleCount: {type: Number, default: 0}
},{ timestamps: true })

export interface Demographics extends mongoose.Document {
    internshipId: String,
    age16To20Count: number,
    age21To25Count: number,
    maleCount: number,
    femaleCount: number
}