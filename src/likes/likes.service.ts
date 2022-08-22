import { Injectable, NotFoundException } from '@nestjs/common';
// import { RpcException } from '@nestjs/microservices';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
import { LikesDataService } from './likes.data.service';
import { likesDTO } from './likes.dto';
// import { Likes } from './likes.model';

@Injectable()
export class LikesService {
    constructor(
        private readonly likesDataService: LikesDataService
    ) {}

    async insertLike (likeObj:likesDTO){
        try{
            const newLike = this.likesDataService.insertLike(likeObj);
            return newLike;
        }
        catch(err){
            return err
        }
    }

    async getLikesByPostId(postId:String){
        const likes = await this.likesDataService.getLikesByPostId(postId);
        if(!likes){
            return null
        }
        else{
            return likes;
        }
    }

    async getLikesByPostIdAndPage(postId:String,startIndex:number,endIndex:number){
        const likes = await this.likesDataService.getLikesByPostIdAndPage(postId,startIndex,endIndex);
        if(!likes){
            return null
        }
        else{
            return likes;
        }
    }

    async getLikeUserId(postId:String,userId:String){
        const likes = await this.likesDataService.getLikeUserId(postId,userId);
        if(!likes){
            return null
        }
        else{
            return likes;
        }
    }

    async removeUserLikeFromPost(postId:String,userId:String){
        const likes = await this.likesDataService.removeUserLikeFromPost(postId,userId);
        if(!likes){
            return null
        }
        else{
            return likes;
        }
    }

    async updateLikeByPostId(postId:String, likeObj:any){
        const likes:any = await this.likesDataService.updateLikeByPostId(postId,likeObj);
        if(!likes){
            throw (new NotFoundException("There is no likes for this post"));
        }
        else{
            return likes;
        }
    }

    async checkUserLikes (userId: string, postIds: any){
        return await this.likesDataService.checkUsersLikes(userId, postIds);
      }

}
