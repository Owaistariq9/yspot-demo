
import { IsArray, IsBoolean, IsEmail, IsNumber, IsObject, IsString } from "class-validator";

export class userDTO {
    @IsString()
    userId:string = "";
    @IsArray()
    notificationTokens:Array<Map<string,string>> = [];

}