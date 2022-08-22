
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEmail, IsNumber, IsObject, IsString, ValidateNested } from "class-validator";

export class MediaDto {
    @IsString()
    name: String;
    @IsString()
    contentType: String;
    @IsString()
    url: String;
    @IsString()
    mediaType: String;
}
export class UpdateUserDto {
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
    data:Object;
    @Type(() => MediaDto)
    @ValidateNested()
    media: MediaDto[]
    @IsArray()
    socialLogin:Array<Object>;
}