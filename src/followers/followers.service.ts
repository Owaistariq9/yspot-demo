import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { isValidObjectId } from 'mongoose';
import { UsersDataService } from 'src/users/user.data.service';
import { FollowersDataService } from './followers.data.service';

@Injectable()
export class FollowersService {
    constructor(private readonly usersDataService: UsersDataService, private readonly followersDataService: FollowersDataService){}

    async addUserFollower(userId: string, followerId: string) {
        if(!isValidObjectId(followerId)){
            throw new RpcException(new BadRequestException("Invalid followerId"));
        }
        let followerObj = {
            userId: userId,
            followerId: followerId
        }
        let check = await this.followersDataService.getFollower(userId,followerId);
        if(check){
            throw new RpcException(new BadRequestException("User is already being followed"));
        }
        let user = await this.usersDataService.incfollowingCount(userId);
        let followerUser = await this.usersDataService.incfollowerCount(followerId);
        return await this.followersDataService.addFollower(followerObj);
    }

    async removeUserFollower(userId: string, followerId: string) {
        if(!isValidObjectId(followerId)){
            throw new RpcException(new BadRequestException("Invalid followerId"));
        }
        let check = await this.followersDataService.getFollower(userId,followerId);
        if(!check){
            throw new RpcException(new BadRequestException("This user is not being followed"));
        }
        let user = await this.usersDataService.decfollowingCount(userId);
        let followerUser = await this.usersDataService.decfollowerCount(followerId);
        return await this.followersDataService.removeFollower(userId,followerId);
    }

    async getAllFollowers(userId: string) {
        if(!isValidObjectId(userId)){
            throw new RpcException(new BadRequestException("Invalid userId"));
        }
        let followerList = [];
        let followers = await this.followersDataService.getAllUserFollowings(userId);
        followers.forEach ( x => {
            followerList.push(x.userId)
        } )
        return followerList;
    }

    async getFollowers(userId: string, page: number, limit: number) {
        if(!isValidObjectId(userId)){
            throw new RpcException(new BadRequestException("Invalid userId"));
        }
        let skip = (page - 1) * limit;
        return await this.followersDataService.getFollowersByPage(userId,limit,skip);
    }

    async getFollowings(userId: string, page: number, limit: number) {
        if(!isValidObjectId(userId)){
            throw new RpcException(new BadRequestException("Invalid userId"));
        }
        let skip = (page - 1) * limit;
        return await this.followersDataService.getFollowingByPage(userId,limit,skip);
    }
}
