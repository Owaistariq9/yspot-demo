import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Followers } from './followers.model';

@Injectable()
export class FollowersDataService {
    constructor(
        @InjectModel('followers') private readonly followerModel: Model<Followers>
    ) {}

    async addFollower(followerObj: any) {
        try{
            const follower = new this.followerModel(followerObj);
            const result = await follower.save();
            return result;
        }
        catch(err){
            return err
        }
    }

    async getFollower(userId:String, followerId:String) {
        try{
          const follower = await this.followerModel.findOne( {$and: [ { "userId": userId }, { "followerId": followerId } ] } ).lean().exec();
          return follower
        }
        catch(err){
          return err
        }
    }

    async getAllUserFollowings(userId:String) {
      try{
        const follower = await this.followerModel.find( { "followerId": userId } ).lean().exec();
        return follower
      }
      catch(err){
        return err
      }
  }

    async getFollowersByPage(userId:String, limit:number, skip:number) {
        try{
          const follower = await this.followerModel.find( { "userId": userId } ).limit(limit).skip(skip).sort('-createdAt').lean().exec();
          return follower
        }
        catch(err){
          return err
        }
    }

    async getFollowingByPage(followerId:String, limit:number, skip:number) {
        try{
          const follower = await this.followerModel.find( { "followerId": followerId } ).limit(limit).skip(skip).sort('-createdAt').lean().exec();
          return follower
        }
        catch(err){
          return err
        }
    }

    async removeFollower(userId:String, followerId:String) {
        try{
          const follower = await this.followerModel.findOneAndDelete( {$and: [ { "userId": userId }, { "followerId": followerId } ] } ).lean().exec();
          return follower
        }
        catch(err){
          return err
        }
    }


}