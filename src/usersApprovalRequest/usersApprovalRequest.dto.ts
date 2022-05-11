import { IsNumber, IsString, IsMongoId } from "class-validator";

export class usersApprovalRequestDTO {
    @IsString()
    @IsMongoId()
    userId: String = ""
    @IsString()
    status: String = ""
    @IsString()
    email: String = ""
    @IsString()
    fullName: String = ""
    @IsString()
    profilePicture:String = ""
    @IsNumber()
    createdOnDate: Number = 0
    @IsString()
    userType: String = ""
}