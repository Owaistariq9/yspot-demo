import { Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FollowersService } from './followers.service';

@Controller('followers')
export class FollowersController {
    constructor(private readonly followersService: FollowersService) {}

    @UseGuards(JwtAuthGuard)
    @Post(":followerId")
    // @MessagePattern("addFollower")
    async addFollower(@Request() req:any){
        let follower = await this.followersService.addUserFollower(req.user.userId, req.params.followerId);
        return follower;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":followerId")
    // @MessagePattern("removeFollower")
    async removeFollower(@Request() req:any){
        let follower = await this.followersService.removeUserFollower(req.user.userId, req.params.followerId);
        return follower;
    }

    @UseGuards(JwtAuthGuard)
    @Get("ownFollowers/:page/:limit")
    // @MessagePattern("getFollowers")
    async getFollowers(@Request() req:any){
        let follower = await this.followersService.getFollowers(req.user._id,req.params.page,req.params.limit);
        return follower;
    }

    // @MessagePattern("getAllFollowers")
    // async getAllFollowers(@Payload() userId:any){
    //     let follower = await this.followersService.getAllFollowers(userId);
    //     return follower;
    // }

    @UseGuards(JwtAuthGuard)
    @Get("ownFollowings/:page/:limit")
    // @MessagePattern("getFollowing")
    async getFollowing(@Request() req:any){
        let follower = await this.followersService.getFollowings(req.user._id,req.params.page,req.params.limit);
        return follower;
    }

    @UseGuards(JwtAuthGuard)
    @Get("userFollowers/:userId/:page/:limit")
    async getUserFollowers(@Request() req:any){
        let follower = await this.followersService.getFollowers(req.params.userId,req.params.page,req.params.limit);
        return follower;
    }

    @UseGuards(JwtAuthGuard)
    @Get("userFollowings/:userId/:page/:limit")
    async getUserFollowings(@Request() req:any){
        let follower = await this.followersService.getFollowings(req.params.userId,req.params.page,req.params.limit);
        return follower;
    }
    
    // // @UseGuards(JwtAuthGuard)
    // // @Get("userFollowers/:userId/:page/:limit")
    // @MessagePattern("getUserFollowers")
    // async getUserFollowers(@Payload() data:any){
    //     let follower = await this.followersService.getFollowers(data.userId,data.page,data.limit);
    //     return follower;
    // }

    // // @UseGuards(JwtAuthGuard)
    // // @Get("userFollowings/:userId/:page/:limit")
    // @MessagePattern("getUserFollowings")
    // async getUserFollowings(@Payload() data:any){
    //     let follower = await this.followersService.getFollowings(data.userId,data.page,data.limit);
    //     return follower;
    // }

}
