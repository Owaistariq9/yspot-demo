import { Controller, Post, Get, Request, UseGuards, Param, NotFoundException, BadRequestException, Delete, Put } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Constants } from 'src/core/constants/constants';
import { InternshipsService } from 'src/internships/internships.service';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostsService } from 'src/posts/posts.service';
import { commentsDTO } from './comments.dto';
import { CommentsService } from './comments.service';

@Controller()
export class CommentsController {
    constructor(private readonly commentService:CommentsService,
        private readonly postsService:PostsService,
        private readonly internshipsService: InternshipsService){}

    // @UseGuards(JwtAuthGuard)
    // @Post('posts/:postId/comments')
    @MessagePattern("comment")
    async comment(@Payload() data:any){
        let commentObj:commentsDTO = {
            "comment": data.body,
            "postId": data.postId
        };
        if(data.postType === Constants.internship){
            let post = await this.internshipsService.incCommentCountByPostId(data.postId);
        }
        else{
            let post = await this.postsService.incCommentCountByPostId(data.postId);
        }
        let comments = await this.commentService.getCommentsByPostId(commentObj.postId);
        if(!comments){
            let newComment = await this.commentService.insertComment(commentObj);
            return { "comments": newComment} ;
        }
        else{
            let newComment = await this.commentService.updateCommentByPostId(commentObj.postId,data.body);
            return { "comments": newComment} ;
        }
    }

    // @UseGuards(JwtAuthGuard)
    // @Get('posts/:postId/comments')
    @MessagePattern("getComment")
    async getComment(@Payload() postId:String){
        let comments = await this.commentService.getCommentsByPostId(postId);
        if(!comments){
            throw new RpcException(new NotFoundException("There are no comments on this post"));
        }
        return { "comments": comments};
    }

    // @UseGuards(JwtAuthGuard)
    // @Get('posts/:postId/commentsIndex/:startIndex/:endIndex')
    @MessagePattern("getCommentByIndex")
    async getCommentsByIndex(@Payload() data:any){
        let comments = await this.commentService.getCommentsByPostIdAndPage(data.postId,data.startIndex,data.endIndex);
        if(!comments){
            throw new RpcException(new NotFoundException("There are no comments on this post"));
        }
        return { "comments": comments};
    }

    // @UseGuards(JwtAuthGuard)
    // @Put('posts/:postId/updateComment')
    @MessagePattern("updateUserComment")
    async updateUserComment(@Payload() req:any){
        if(req.user._id !== req.body.userId){
            throw new RpcException(new BadRequestException("Unable to edit other's comments"));
        }
        let comments = await this.commentService.updateUserComment(req.params.postId,req.body);
        if(!comments){
            throw new RpcException(new NotFoundException("There are no comments on this post"));
        }
        return { "comments": comments};
    }

    // @UseGuards(JwtAuthGuard)
    // @Put('posts/:postId/deleteOwnComment/:commentId')
    @MessagePattern("deleteOwnComment")
    async deleteOwnComment(@Payload() req:any){
        if(req.user._id !== req.body.userId){
            throw new RpcException(new BadRequestException("Unable to delete other's comments"));
        }
        if(!req.body.commentId){
            throw new RpcException(new BadRequestException("Missing field: commentId"));
        }
        let comments = await this.commentService.deleteComment(req.params.postId,req.body.commentId);
        if(!comments){
            throw new RpcException(new NotFoundException("There are no comments on this post"));
        }
        if(req.params.postType === Constants.internship){
            let post = await this.internshipsService.decCommentCountByPostId(req.params.postId);
        }
        else{
            let post = await this.postsService.decCommentCountByPostId(req.params.postId);
        }
        return { "data": comments};
    }

    // @UseGuards(JwtAuthGuard)
    // @Put('posts/:postId/deleteComments')
    @MessagePattern("deleteComments")
    async deleteComments(@Payload() req:any){
        let post:any;
        if(!req.body.commentId){
            throw new RpcException(new BadRequestException("Missing field: commentId"));
        }
        if(req.params.postType === Constants.internship){
            post = await this.internshipsService.getInternshipById(req.params.postId);
        }
        else{
            post = await this.postsService.getPostById(req.params.postId);
        }
        if(post.userId != req.user._id){
            throw new RpcException(new BadRequestException("The post does not belong to this user"));
        }
        let comments = await this.commentService.deleteComment(req.params.postId,req.body.commentId);
        if(!comments){
            throw new RpcException(new NotFoundException("There are no comments on this post"));
        }
        if(req.params.postType === Constants.internship){
            post = await this.internshipsService.decCommentCountByPostId(req.params.postId);
        }
        else{
            post = await this.postsService.decCommentCountByPostId(req.params.postId);
        }
        return { "data": comments};
    }
}
