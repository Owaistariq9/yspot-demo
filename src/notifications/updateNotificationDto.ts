
import { IsArray, IsBoolean, IsEmail, IsNumber, IsObject, IsString } from "class-validator";

export class UpdateNotificationDto {
    @IsString()
    fullName:string;
    @IsNumber()
    age:number;
    @IsString()
    gender: string;
    @IsString()
    phone:string;
    @IsString()
    country:string;
    @IsString()
    city:string;
    @IsString()
    state:string;
    @IsString()
    zipCode:string;
    @IsString()
    address:string;
    @IsString()
    bio:string;
    @IsString()
    qualification:string;
    @IsString()
    institute:string;
    @IsString()
    startYear:string;
    @IsString()
    endYear:string;
    @IsString()
    profilePicture:string;
    @IsString()
    userType:string;
    @IsBoolean()
    notificationSettings:Boolean;
    @IsBoolean()
    IsSocialLogin:Boolean;
    @IsObject()
    data:Object = {};
    @IsArray()
    socialLogin:Array<Object> = [];
}