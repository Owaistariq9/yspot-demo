import { Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentsDataService } from './comments.data.service';
import { commentsDTO } from './comments.dto';
import { Comments } from './comments.model';

@Injectable()
export class CommentsService {
    constructor(
        private readonly commentsDataService:CommentsDataService
    ) {}

    async insertComment (commentObj:commentsDTO){
        try{
            const newComment = this.commentsDataService.insertComment(commentObj);
            return newComment;
        }
        catch(err){
            return err
        }
    }

    async getCommentsByPostId(postId:String){
        const comments = await this.commentsDataService.getCommentsByPostId(postId);
        if(!comments){
            return null
        }
        else{
            return comments;
        }
    }

    async getCommentsByPostIdAndPage(postId:String,startIndex:number,endIndex:number){
        const comments = await this.commentsDataService.getCommentsByPostIdAndPage(postId,startIndex,endIndex);
        if(!comments){
            return null
        }
        else{
            return comments;
        }
    }

    async updateCommentByPostId(postId:String, commentObj:any){
        const comments:any = await this.commentsDataService.updateCommentByPostId(postId,commentObj);
        if(!comments){
            throw new RpcException(new NotFoundException("There is no comments for this post"));
        }
        else{
            return comments.comment[comments.comment.length - 1];
        }
    }

    async updateUserComment(postId:String, commentObj:any){
        const comments:any = await this.commentsDataService.updateUserComment(postId,commentObj);
        if(!comments){
            throw new RpcException(new NotFoundException("There is no comments for this post"));
        }
        else{
            return comments.comment[comments.comment.length - 1];
        }
    }

    async deleteComment(postId:String, commentId:String){
        const comments = await this.commentsDataService.deleteComment(postId,commentId);
        if(!comments){
            throw new RpcException(new NotFoundException("There is no comments for this post"));
        }
        else{
            return "Comment deleted.";
        }
    }
}
