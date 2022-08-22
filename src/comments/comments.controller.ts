import { Controller, Post, Get, Request, UseGuards, Param, NotFoundException, BadRequestException, Delete, Put, Patch } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Constants } from 'src/core/constants/constants';
import { InternshipsService } from 'src/internships/internships.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostsService } from 'src/posts/posts.service';
import { commentsDTO } from './comments.dto';
import { CommentsService } from './comments.service';

@Controller()
export class CommentsController {
    constructor(private readonly commentService:CommentsService,
        private readonly postsService:PostsService,
        private readonly internshipsService: InternshipsService){}

    @UseGuards(JwtAuthGuard)
    // @MessagePattern("comment")
    @Post('posts/:postId/:postType/comments')
    async comment(@Request() req:any){
        let commentObj:commentsDTO = {
            "comment": req.body,
            "postId": req.params.postId
        };
        if(req.params.postType === Constants.internship){
            let post = await this.internshipsService.incCommentCountByPostId(req.params.postId);
        }
        else{
            let post = await this.postsService.incCommentCountByPostId(req.params.postId);
        }
        let comments = await this.commentService.getCommentsByPostId(commentObj.postId);
        if(!comments){
            let newComment = await this.commentService.insertComment(commentObj);
            return { "comments": newComment} ;
        }
        else{
            let newComment = await this.commentService.updateCommentByPostId(commentObj.postId,req.body);
            return { "comments": newComment} ;
        }
    }

    @UseGuards(JwtAuthGuard)
    // @MessagePattern("getComment")
    @Get('posts/:postId/comments')
    async getComment(@Param('postId') postId:String){
        let comments = await this.commentService.getCommentsByPostId(postId);
        if(!comments){
            throw (new NotFoundException("There are no comments on this post"));
        }
        return { "comments": comments};
    }

    @UseGuards(JwtAuthGuard)
    // @MessagePattern("getCommentByIndex")
    @Get('posts/:postId/comments/:startIndex/:endIndex')
    async getCommentsByIndex(@Request() req:any){
        let comments = await this.commentService.getCommentsByPostIdAndPage(req.params.postId,req.params.startIndex,req.params.endIndex);
        if(!comments){
            throw (new NotFoundException("There are no comments on this post"));
        }
        return { "comments": comments};
    }

    @UseGuards(JwtAuthGuard)
    // @MessagePattern("getCommentByIndex")
    @Get('posts/:postId/approve-comments/:startIndex/:endIndex')
    async getApproveCommentsByIndex(@Request() req:any){
        let comments = await this.commentService.getApprovedComments(req.params.postId,req.params.startIndex,req.params.endIndex);
        if(!comments){
            throw (new NotFoundException("There are no comments on this post"));
        }
        return { "comments": comments};
    }

    @UseGuards(JwtAuthGuard)
    // @MessagePattern("getCommentByIndex")
    @Get('posts/:postId/unapprove-comments/:startIndex/:endIndex')
    async getUnapproveCommentsByIndex(@Request() req:any){
        let comments = await this.commentService.getUnapprovedComments(req.params.postId,req.params.startIndex,req.params.endIndex);
        if(!comments){
            throw (new NotFoundException("There are no comments on this post"));
        }
        return { "comments": comments};
    }

    @UseGuards(JwtAuthGuard)
    // @MessagePattern("updateUserComment")
    @Put('posts/:postId/updateComment')
    async updateUserComment(@Request() req:any){
        if(req.user._id !== req.body.userId){
            throw (new BadRequestException("Unable to edit other's comments"));
        }
        let comments = await this.commentService.updateUserComment(req.params.postId,req.body);
        if(!comments){
            throw (new NotFoundException("There are no comments on this post"));
        }
        return { "comments": comments};
    }

    @UseGuards(JwtAuthGuard)
    // @MessagePattern("updateUserComment")
    @Patch('comment/:commentId/posts/:postId/approve')
    async approveUserComment(@Request() req:any){
        if(req.user.userClaims.userType !== Constants.business){
            throw (new BadRequestException("Only business accounts can approve comments"));
        }
        let comments = await this.commentService.approveUserComment(req.params.postId,req.params.commentId);
        if(!comments){
            throw (new NotFoundException("There are no comments on this post"));
        }
        return { "comments": comments};
    }

    @UseGuards(JwtAuthGuard)
    // @MessagePattern("deleteOwnComment")
    @Put(':postType/:postId/deleteOwnComment/:commentId')
    async deleteOwnComment(@Request() req:any){
        if(req.user._id !== req.body.userId){
            throw (new BadRequestException("Unable to delete other's comments"));
        }
        if(!req.body.commentId){
            throw (new BadRequestException("Missing field: commentId"));
        }
        let comments = await this.commentService.deleteComment(req.params.postId,req.body.commentId);
        if(!comments){
            throw (new NotFoundException("There are no comments on this post"));
        }
        if(req.params.postType === Constants.internship){
            let post = await this.internshipsService.decCommentCountByPostId(req.params.postId);
        }
        else{
            let post = await this.postsService.decCommentCountByPostId(req.params.postId);
        }
        return { "data": comments};
    }

    // @MessagePattern("deleteComments")
    @UseGuards(JwtAuthGuard)
    @Put(':postType/:postId/deleteComments')
    async deleteComments(@Request() req:any){
        let post:any;
        if(!req.body.commentId){
            throw (new BadRequestException("Missing field: commentId"));
        }
        if(req.params.postType === Constants.internship){
            post = await this.internshipsService.getInternshipById(req.params.postId);
        }
        else{
            post = await this.postsService.getPostById(req.params.postId);
        }
        if(post.userId != req.user._id){
            throw (new BadRequestException("The post does not belong to this user"));
        }
        let comments = await this.commentService.deleteComment(req.params.postId,req.body.commentId);
        if(!comments){
            throw (new NotFoundException("There are no comments on this post"));
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
