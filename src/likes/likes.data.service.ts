import { Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { likesDTO } from './likes.dto';
import { Likes } from './likes.model';

@Injectable()
export class LikesDataService {
    constructor(
        @InjectModel('Likes') private readonly likeModel: Model<Likes>,
    ) {}

    async insertLike (likeObj:likesDTO){
        try{
            const newLike = new this.likeModel(likeObj);
            await newLike.save();
            return newLike;
        }
        catch(err){
            return err
        }
    }

    async getLikesByPostId(postId:String){
        const likes = await this.likeModel.findOne({ postId: postId }).lean().exec();
        if(!likes){
            return null
        }
        else{
            return likes;
        }
    }

    async getLikesByPostIdAndPage(postId:String,startIndex:number,endIndex:number){
        const likes = await this.likeModel.findOne({ postId: postId }).slice('like',[startIndex,endIndex])
        if(!likes){
            return null
        }
        else{
            return likes;
        }
    }

    async getLikeUserId(postId:String,userId:String){
        const likes = await this.likeModel.findOne({$and:[{ "like.userId": userId }, {postId:postId}]});
        if(!likes){
            return null
        }
        else{
            return likes;
        }
    }

    async removeUserLikeFromPost(postId:String,userId:String){
        const likes = await this.likeModel.findOneAndUpdate({$and:[{ "like.userId": userId }, {postId:postId}]},
        {$pull: {like: { userId: userId } } } );
        if(!likes){
            return null
        }
        else{
            return likes;
        }
    }

    async updateLikeByPostId(postId:String, likeObj:any){
        const likes = await this.likeModel.findOneAndUpdate({"postId": postId},{$push:{like:likeObj}},{new:true}).lean().exec();
        if(!likes){
            throw new RpcException(new NotFoundException("There is no likes for this post"));
        }
        else{
            return likes.like[likes.like.length - 1];
        }
    }

    async checkUsersLikes(userId: string, postIds: any) {
        try {
          const userLikeExist = await this.likeModel.find({ "like.userId": userId, postId: {$in: postIds}}).lean().exec();
          return userLikeExist;
        } catch (err) {
          return err;
        }
      }

}
