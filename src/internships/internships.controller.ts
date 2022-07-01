import { BadRequestException, Body, Controller, Delete, Get, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Constants } from 'src/core/constants/constants';
import { feedbackDto, internshipDTO, ResponseDTO, updateInternshipDTO } from './internships.dto';
import { InternshipsService } from './internships.service';

@Controller('internships')
export class InternshipsController {
    constructor(private readonly internshipsService:InternshipsService){}

    @UseGuards(JwtAuthGuard)
    @Post()
    // @MessagePattern("addInternship")
    async addInternship(@Request() req:any,
    @Body() data:internshipDTO){
        if(req.user.userClaims.userType !== Constants.business){
            throw new BadRequestException("Only business account can add internships");
        }
        data.userId = req.user._id
        const posts = await this.internshipsService.insertInternship(data);
        return posts;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":internshipId")
    // @MessagePattern("deleteInternship")
    async deleteInternship(@Request() req:any){
        if(req.user.userClaims.userType !== Constants.business){
            throw new BadRequestException("Only business account can delete internships");
        }
        let userId = req.user._id;
        let internship = await this.internshipsService.getInternshipById(req.params.internshipId);
        if(internship.userId !== userId){
            throw new BadRequestException("This internship cannot be deleted by this user.");
        }
        let deletedInternship = await this.internshipsService.deleteInternship(req.params.internshipId);
        return "Deleted internship with internshipId " + internship._id ;
    }

    @UseGuards(JwtAuthGuard)
    @Patch(":internshipId")
    // @MessagePattern("updateInternship")
    async updateInternship(@Request() req:any,
    @Body() data:updateInternshipDTO){
        if(req.user.userClaims.userType !== Constants.business){
            throw new BadRequestException("Only business account can add internships");
        }
        let userId = req.user._id;
        let internship = await this.internshipsService.getInternshipById(req.params.internshipId);
        let obj = data;
        if(internship.userId !== userId){
            throw new BadRequestException("This internship cannot be edited by this user.");
        }
        let updatedPost = await this.internshipsService.updateInternship(req.params.internshipId, obj);
        return updatedPost;
    }

    
    @UseGuards(JwtAuthGuard)
    @Get(":internshipId")
    async getInternshipById(@Request() req:any){
        const internship = await this.internshipsService.getInternshipDataById(req.params.internshipId, req.user._id);
        return {"Internship": internship};
    }

    @UseGuards(JwtAuthGuard)
    @Get(":page/:limit")
    // @MessagePattern("getInternshipsByPage")
    async getInternshipsByPage(@Request() req:any){
        const internships:any = await this.internshipsService.getInternshipByPage(req.params.page,req.params.limit,req.user._id);
        return internships;
    }

    // @MessagePattern("getInternshipsByPage")
    @UseGuards(JwtAuthGuard)
    @Get("filter/:sort/:industry/:isPaid/:country/:page/:limit")
    async getFilteredInternshipsByPage(@Request() req:any){
        if(req.params.isPaid === "true"){
            req.params.isPaid = true
        }
        else{
            req.params.isPaid = false
        }
        return await this.internshipsService.getFilteredInternships(req.params.industry, req.params.isPaid, req.params.country, req.params.sort, req.params.page, req.params.limit, req.user._id);
        // return {"internships": internships};
    }

    @UseGuards(JwtAuthGuard)
    @Get("/user/:page/:limit")
    // @MessagePattern("getInternshipsByPage")
    async getAllUsersInternships(@Request() req:any){
        let internships:any = await this.internshipsService.getUsersInternshipByPage(req.params.page,req.params.limit,req.user._id);
        return internships;
    }

    @UseGuards(JwtAuthGuard)
    @Post(":internshipId/recommand")
    // @MessagePattern("addRecommand")
    async addRecommand(@Request() req:any){
        if(!req.body.recommandList){
            throw new BadRequestException("recommandList required!")
        }
        if(!req.body.recommandList[0]){
            throw new BadRequestException("recommandList cannot be empty!")
        }
        const recommands = await this.internshipsService.addRecommands(req.body.recommandList,req.user._id,req.params.internshipId);
        return recommands;
    }

    @UseGuards(JwtAuthGuard)
    @Get("recommanded/:page/:limit")
    // @MessagePattern("addRecommand")
    async getAllRecommandedInternships(@Request() req:any){
        const recommands = await this.internshipsService.getRecommandedInternships(req.user._id,req.params.page,req.params.limit);
        return {"recommandedTnternships": recommands};
    }

    @UseGuards(JwtAuthGuard)
    @Put(":internshipId/elastic")
    async updateInternshipInElasticSearch(@Request() req:any){
        const internship = await this.internshipsService.updateInternshipInElasticSearch(req.params.internshipId);
        return {"updatedInternship": internship};
    }

    @UseGuards(JwtAuthGuard)
    @Put(":internshipId/feedback/:userId")
    async updateInternshipFeedback(@Request() req:any,
    @Body() data: feedbackDto){
        if(req.user.userClaims.userType !== Constants.business){
            throw new BadRequestException("Only business account can add feedbacks");
        }
        const internship = await this.internshipsService.updateUserInternshipFeedback(data, req.params.userId, req.params.internshipId);
        return {"updatedInternshipFeedback": internship};
    }

    @UseGuards(JwtAuthGuard)
    @Get(":internshipId/feedback/:userId")
    async getInternshipFeedback(@Request() req:any){
        if(req.user.userClaims.userType !== Constants.business){
            throw new BadRequestException("Only business account can see feedbacks");
        }
        const internship = await this.internshipsService.getUserInternshipFeedback(req.params.userId, req.params.internshipId);
        return {"internshipFeedback": internship};
    }

    // @MessagePattern("submitInternshipResponse")
    // async submitInternshipResponse(@Payload() data:any){
    //     let recommands = await this.internshipsService.addResponse(data.responseObj,data.userId);
    //     return recommands;
    // }
}
