import { Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { commentsDTO } from './comments.dto';
import { Comments } from './comments.model';

@Injectable()
export class CommentsDataService {
    constructor(
        @InjectModel('Comments') private readonly commentModel: Model<Comments>,
    ) {}

    async insertComment (commentObj:commentsDTO){
        try{
            const newComment = new this.commentModel(commentObj);
            await newComment.save();
            return newComment;
        }
        catch(err){
            return err
        }
    }

    async getCommentsByPostId(postId:String){
        const comments = await this.commentModel.findOne({ postId: postId }).lean().exec();
        if(!comments){
            return null
        }
        else{
            return comments;
        }
    }

    async getCommentsByPostIdAndPage(postId:String,startIndex:number,endIndex:number){
        const comments = await this.commentModel.findOne({ postId: postId }).slice("comment",[+startIndex,+endIndex]).lean().exec();
        if(!comments){
            return null
        }
        else{
            return comments;
        }
    }

    async getApprovedCommentsByPostIdAndPage(postId:String, startIndex:number, endIndex:number){
        // console.log("approve");
        // const comments = await this.commentModel.findOne({$and: [ { postId: postId }, {"comment.$.approved": true} ] } ).slice("comment",[+startIndex,+endIndex]).lean().exec();
        // if(!comments){
        //     return null
        // }
        // else{
        //     return comments;
        // }
        const comments = await this.commentModel.aggregate([
            {$match:{ postId: postId } },
            
            {$unwind:"$comment"},
            
            {$match: {$expr:  {$eq: ["$comment.approved", true] } } },
            {$group: {
             _id: "$_id",
             postId: {$first: "$postId"},
             comment: {$push: "$comment"},
             createdAt: {$first: "$postId"},
             updatedAt: {$first: "$postId"},
             }},
             {$addFields:{
                 comment:{$slice:["$comment", +startIndex, +endIndex]}
                 }}
            ])
        if(!comments[0]){
            return null
        }
        else{
            return comments[0];
        }
    }

    async getUnapprovedCommentsByPostIdAndPage(postId:String,startIndex:number,endIndex:number){
        // console.log("unapprove");
        // const comments = await this.commentModel.findOne({"comment": {$elemMatch: {userId: "62c2e6ac9526cfcd8a5efc26" } } } ).lean().exec();
        const comments = await this.commentModel.aggregate([
            {$match:{ postId: postId } },
            
            {$unwind:"$comment"},
            
            {$match: {$expr:  {$eq: ["$comment.approved", false] } } },
            {$group: {
             _id: "$_id",
             postId: {$first: "$postId"},
             comment: {$push: "$comment"},
             createdAt: {$first: "$postId"},
             updatedAt: {$first: "$postId"},
             }},
             {$addFields:{
                 comment:{$slice:["$comment", +startIndex, +endIndex]}
                 }}
            ])
        if(!comments[0]){
            return null
        }
        else{
            return comments[0];
        }
    }

    async updateCommentByPostId(postId:String, commentObj:any){
        const comments = await this.commentModel.findOneAndUpdate( { 'postId': postId }, { $push: { comment: commentObj } },{new:true}).lean().exec();
        if(!comments){
            throw (new NotFoundException("There is no comments for this post"));
        }
        else{
            return comments;
        }
    }

    async approveUserComment(postId:String, commentId: String){
        const comments = await this.commentModel.findOneAndUpdate({postId: postId, "comment._id": commentId}, { $set:{ "comment.$.approved": true } },{new:true}).lean().exec();
        if(!comments){
            throw (new NotFoundException("There is no comments for this post"));
        }
        else{
            return comments;
        }
    }

    async updateUserComment(postId:String, commentObj:any){
        const comments = await this.commentModel.findOneAndUpdate({postId:postId, "comment._id":commentObj._id},{$set:{"comment.$":commentObj}},{new:true}).lean().exec();
        if(!comments){
            throw (new NotFoundException("There is no comments for this post"));
        }
        else{
            return comments;
        }
    }

    async deleteComment(postId:String, commentId:String){
        const comments = await this.commentModel.findOneAndUpdate({postId:postId},{$pull: {"comment": { _id : commentId }}}).lean().exec();
        if(!comments){
            throw (new NotFoundException("There is no comments for this post"));
        }
        else{
            return "Comment deleted.";
        }
    }
}
