import * as mongoose from "mongoose";
import { MediaType } from "../../posts/postsTypes.enum";
const Schema = mongoose.Schema;

export const InternshipsSchema = new Schema(
{
    userId:String,
    description:String,
    title:String,
    company:String,
    website:String,
    businessWebsite:String,
    businessPhone: String,
    industry:String,
    country:String,
    city:String, 
    startSalary: Number,
    endSalary: Number,
    isPaid: {type:Boolean, default:false},
    responseCount:{type:Number, default:0},
    commentsCount:{type:Number, default:0},
    viewCount:{type:Number, default:0},
    recommandCount:{type:Number, default:0},
    media: [{}],
    data: {},
    startTime:String,
    endTime:String
},{ timestamps: true })

export interface Internships extends mongoose.Document {
    userId:String,
    description:String,
    title:String,
    company:String,
    industry:String,
    country:String,
    city:String,
    website:String,
    businessWebsite:String,
    businessPhone: String, 
    commentsCount:number,
    viewCount:number,
    startSalary: number,
    endSalary: number,
    expLevel: String,
    recommandCount:number,
    media: [{
        contentType:String,
        url:String,
        mediaType: MediaType
    }],
    data: {},
    startTime:String,
    endTime:String
}