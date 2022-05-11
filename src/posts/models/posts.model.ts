import * as mongoose from "mongoose";
import { MediaType, PostsType } from "../postsTypes.enum";
const Schema = mongoose.Schema;

export const PostsSchema = new Schema(
{
    userId:String,
    description:String,
    privacyFilter:{
        startAge:Number,
        endAge:Number,
        countries: [],
        gender:String,
        visibility:String,
        visibleToRoles:String,
        users: []
    },
    commentsCount:{type:Number, default:0},
    likesCount:{type:Number, default:0},
    checkIn: {},
    media: [{}],
    data: {},
    startTime:String,
    endTime:String,
    type: String,
},{ timestamps: true })

export interface Post extends mongoose.Document {
    userId:String,
    description:String,
    privacyFilter:{
        startAge:Number,
        endAge:Number,
        countries: [],
        gender:String,
        visibility:String,
        visibleToRoles:String,
        users: []
    },
    commentsCount:number,
    likesCount:number,
    checkIn: {},
    media: [{
        contentType:String,
        url:String,
        type: MediaType
    }],
    data: {},
    startTime:String,
    endTime:String,
    type: PostsType
}