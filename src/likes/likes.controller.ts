import { BadRequestException, Controller, Delete, Get, NotFoundException, Param, Post, Request, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostsService } from 'src/posts/posts.service';
import { likesDTO } from './likes.dto';
import { LikesService } from './likes.service';

@Controller()
export class LikesController {

    constructor(private readonly likeService:LikesService,
        private readonly postsService:PostsService){}

    // @UseGuards(JwtAuthGuard)
    // @Post('posts/:postId/likes')
    @MessagePattern("like")
    async like(@Payload() req:any){
        let likeObj:likesDTO = {
            "like": req.body,
            "postId": req.params.postId
        };
        let post = await this.postsService.incLikeCountByPostId(req.params.postId);
        let likes = await this.likeService.getLikesByPostId(likeObj.postId);
        if(!likes){
            let newLike = await this.likeService.insertComment(likeObj);
            return { "likes": newLike} ;
        }
        else{
            let check = await this.likeService.getLikeUserId(req.params.postId,req.body.userId);
            if(check){
                throw new RpcException(new BadRequestException("User already liked this post"));
            }
            let newLike = await this.likeService.updateLikeByPostId(likeObj.postId,req.body);
            return { "likes": newLike} ;
        }
    }

    // @UseGuards(JwtAuthGuard)
    // @Delete('posts/:postId/dislike')
    @MessagePattern("dislike")
    async dislike(@Payload() req:any){
        let like = await this.likeService.removeUserLikeFromPost(req.params.postId,req.user._id);
        if(!like){
            throw new RpcException(new NotFoundException("Cannot find like of user on this post"));
        }
        let post = await this.postsService.decLikeCountByPostId(req.params.postId);
        return req.params.postId+" disliked by "+req.user._id;
    }

    // @UseGuards(JwtAuthGuard)
    // @Get('posts/:postId/likes')
    @MessagePattern("getLike")
    async getLike(@Payload() postId:String){
        let likes = await this.likeService.getLikesByPostId(postId);
        if(!likes){
            throw new RpcException(new NotFoundException("There are no likes on this post"));
        }
        return { "likes": likes};
    }

    // @UseGuards(JwtAuthGuard)
    // @Get('posts/:postId/likeIndex/:startIndex/:endIndex')
    @MessagePattern("getLikesByIndex")
    async getLikesByIndex(@Payload() params: any){
        let likes = await this.likeService.getLikesByPostIdAndPage(params.postId,params.startIndex,params.endIndex);
        if(!likes){
            throw new RpcException(new NotFoundException("There are no likes on this post"));
        }
        return { "likes": likes};
    }

}
