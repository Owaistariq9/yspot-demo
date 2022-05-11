import { IsArray, IsDefined, IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";

export class internshipDTO {
    @IsString()
    userId:any
    @IsNotEmpty()
    @IsDefined()
    @IsString()
    title:String= "";
    @IsNotEmpty()
    @IsDefined()
    @IsString()
    company:String= "";
    @IsNotEmpty()
    @IsDefined()
    @IsString()
    website:String= "";
    @IsNotEmpty()
    @IsDefined()
    @IsString()
    businessWebsite:String= "";
    @IsNotEmpty()
    @IsDefined()
    @IsString()
    businessPhone:String= "";
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    description:String= "";
    @IsString()
    industry:String="";
    @IsString()
    country:String="";
    @IsString()
    city:String="";
    @IsString()
    educationalInstitute:String="";
    @IsNotEmpty()
    @IsDefined()
    @IsNumber()
    startSalary:Number= 0; 
    @IsNotEmpty()
    @IsDefined()
    @IsNumber()
    endSalary:Number= 0; 
    @IsNumber()
    commentsCount:Number= 0;
    @IsNumber()
    viewCount:Number= 0;
    @IsNumber()
    recommandCount:Number= 0;
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
}

export class updateInternshipDTO {
    @IsString()
    userId:String= "";
    @IsString()
    title:String= "";
    @IsString()
    company:String= "";
    @IsString()
    website:String= "";
    @IsString()
    businessWebsite:String= "";
    @IsString()
    businessPhone:String= "";
    @IsString()
    description:String= "";
    @IsString()
    industry:String="";
    @IsString()
    country:String="";
    @IsString()
    city:String="";
    @IsString()
    educationalInstitute:String="";
    @IsNumber()
    startSalary:Number= 0; 
    @IsNumber()
    endSalary:Number= 0; 
    @IsNumber()
    commentsCount:Number= 0;
    @IsNumber()
    viewCount:Number= 0;
    @IsNumber()
    recommandCount:Number= 0;
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