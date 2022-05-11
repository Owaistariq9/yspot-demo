import { IsArray, IsString } from "class-validator"

export class commentsDTO {
    @IsString()
    postId:String
    @IsArray()
    comment: [{
        userId:String,
        userName:String,
        text:String,
        profilePicture:String,
    }]
}