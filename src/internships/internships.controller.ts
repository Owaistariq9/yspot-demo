import { BadRequestException, Body, Controller, Delete, Get, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Constants } from 'src/core/constants/constants';
import { internshipDTO, ResponseDTO, updateInternshipDTO } from './internships.dto';
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
        let posts = await this.internshipsService.insertInternship(data);
        return posts;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":internshipId")
    // @MessagePattern("deleteInternship")
    async deleteInternship(@Request() req:any){
        if(req.user.userClaims.userType !== Constants.business){
            throw new BadRequestException("Only business account can add internships");
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
    @Get(":page/:limit")
    // @MessagePattern("getInternshipsByPage")
    async getInternshipsByPage(@Request() req:any){
        let internships:any = await this.internshipsService.getInternshipByPage(req.params.page,req.params.limit,req.user._id);
        // console.log("here");
        return internships;
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
        let recommands = await this.internshipsService.addRecommands(req.body.recommandList,req.userId,req.params.internshipId);
        return recommands;
    }

    // @MessagePattern("submitInternshipResponse")
    // async submitInternshipResponse(@Payload() data:any){
    //     let recommands = await this.internshipsService.addResponse(data.responseObj,data.userId);
    //     return recommands;
    // }
}
