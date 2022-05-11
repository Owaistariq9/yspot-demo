import { IsArray, IsDefined, IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";
import { MediaType, PostsType } from "./postsTypes.enum";

export class postDTO {
    @IsString()
    userId:String= "";
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    description:String= "";
    @IsObject()
    privacyFilter;
    @IsNumber()
    commentsCount:Number= 0;
    @IsNumber()
    likesCount:Number= 0;
    @IsObject()
    checkIn: {};
    @IsArray()
    media= [{
        contentType:String,
        url:String,
        type: String
    }]
    @IsObject()
    data: any
    @IsNumber()
    startTime: Number = 0;
    @IsNumber()
    endTime: Number = 0;
    @IsString()
    type: PostsType;
}

export class ResponseDTO {
    @IsString()
    postId: String = "";
    @IsString()
    userId: String = "";
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    postType: String = "";
    @IsObject()
    data: any
}