import { IsArray, IsString } from "class-validator"

export class likesDTO {
    @IsString()
    postId:String
    @IsArray()
    like: [{
        userId:String,
        userName:String,
        profilePicture:String,
    }]
}