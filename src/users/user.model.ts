import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

export const UserSchema = new Schema(
{
    fullName: String,
    email:String,
    password:String,
    age:{ type: Number, default: 0},
    gender:{ type: String, default: ""},
    phone:{ type: String, default: ""},
    profilePicture:{ type: String, default: ""},
    zipCode: { type: String, default: ""},
    country:{ type: String, default: ""},
    city:{ type: String, default: ""},
    state: { type: String, default: ""},
    address: { type: String, default: ""},
    bio: { type: String, default: ""},
    qualification: { type: String, default: ""},
    institute: { type: String, default: ""},
    startYear: { type: String, default: ""},
    endYear: { type: String, default: ""},
    status:{ type: String, default: "pending"},
    notificationSettings: {type:Boolean , default: true},
    IsSocialLogin: {type:Boolean , default: false},
    userType: {type:String , default: "youth"},
    followerCount: {type:Number , default: 0},
    followingCount: {type:Number , default: 0},
    data: {type: Object},
    forgetPasswordTime:Number,
    forgetPasswordToken:String,
    jobStats:{
        applied: {type:Number , default: 0},
        shortlisted: {type:Number , default: 0},
        recommanded: {type:Number , default: 0},
        interviewed: {type:Number , default: 0},
    },
    socialLogin:[{
        profileId: String,
        userName: String,
        url: String,
        accessToken: String,
        socialLoginType: String,
        data: Object
    }]   
},{ timestamps: true }
)

export interface User extends mongoose.Document {
    _id: String
    createdOnDate:Number
    fullName:String
    email:String
    password:String
    age:Number
    gender: String
    phone:String
    profilePicture:String
    country:String
    city:String
    state:String
    zipCode:String
    address:String
    status:String
    notificationSettings:Boolean
    IsSocialLogin:Boolean
    data:Object
    forgetPasswordTime:Number
    forgetPasswordToken:String
    socialLogin:[{
        profileId: String,
        userName: String,
        url: String,
        accessToken: String,
        type: String,
        data: Object
    }]   
}