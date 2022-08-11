import { BadRequestException, Controller, Delete, Get, NotFoundException, Param, Post, Request, UseGuards } from '@nestjs/common';
// import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostsService } from 'src/posts/posts.service';
import { likesDTO } from './likes.dto';
import { LikesService } from './likes.service';

@Controller()
export class LikesController {

    constructor(private readonly likeService:LikesService,
        private readonly postsService:PostsService){}

    @UseGuards(JwtAuthGuard)
    @Post('posts/:postId/likes')
    // @MessagePattern("like")
    async like(@Request() req:any){
        const likeObj:likesDTO = {
            "like": req.body,
            "postId": req.params.postId
        };
        // const post = await this.postsService.incLikeCountByPostId(req.params.postId);
        const likes = await this.likeService.getLikesByPostId(likeObj.postId);
        if(!likes){
            const newLike = await this.likeService.insertLike(likeObj);
            await this.postsService.incLikeCountByPostId(req.params.postId);
            return {"likes": newLike} ;
        }
        else{
            const check = await this.likeService.getLikeUserId(req.params.postId,req.body.userId);
            if(check){
                throw (new BadRequestException("User already liked this post"));
            }
            const newLike = await this.likeService.updateLikeByPostId(likeObj.postId,req.body);
            await this.postsService.incLikeCountByPostId(req.params.postId);
            return {"likes": newLike} ;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('posts/:postId/likes-dislike')
    // @MessagePattern("like")
    async likeOrDislike(@Request() req:any){
        const likeObj:likesDTO = {
            "like": req.body,
            "postId": req.params.postId
        };
        const likes = await this.likeService.getLikesByPostId(likeObj.postId);
        if(!likes){
            await this.postsService.incLikeCountByPostId(req.params.postId);
            const newLike = await this.likeService.insertLike(likeObj);
            return {"likes": newLike} ;
        }
        else{
            let likeExist = false;
            if(likes.like){
                likes.like.forEach(x => {
                    if(x.userId === req.body.userId){
                        likeExist = true;
                    }
                })
            }
            if(likeExist === false){
                await this.postsService.incLikeCountByPostId(req.params.postId);
                const newLike = await this.likeService.updateLikeByPostId(likeObj.postId,req.body);
                return {"likes": newLike};
            }
            else{
                const like = await this.likeService.removeUserLikeFromPost(req.params.postId,req.body.userId);
                await this.postsService.decLikeCountByPostId(req.params.postId);
                return {"message": req.params.postId+" disliked by "+req.user._id};
            }
            // const check = await this.likeService.getLikeUserId(req.params.postId,req.body.userId);
            // if(check){
            //     const like = await this.likeService.removeUserLikeFromPost(req.params.postId,req.body.userId);
            //     await this.postsService.decLikeCountByPostId(req.params.postId);
            //     return {"message": req.params.postId+" disliked by "+req.user._id};
            // }
            // await this.postsService.incLikeCountByPostId(req.params.postId);
            // const newLike = await this.likeService.updateLikeByPostId(likeObj.postId,req.body);
            // return {"likes": newLike};
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('posts/:postId/dislike')
    // @MessagePattern("dislike")
    async dislike(@Request() req:any){
        let like = await this.likeService.removeUserLikeFromPost(req.params.postId,req.user._id);
        if(!like){
            throw (new NotFoundException("Cannot find like of user on this post"));
        }
        let post = await this.postsService.decLikeCountByPostId(req.params.postId);
        return {"message": req.params.postId+" disliked by "+req.user._id};
    }

    @UseGuards(JwtAuthGuard)
    @Get('posts/:postId/likes')
    // @MessagePattern("getLike")
    async getLike(@Request() req:any){
        let likes = await this.likeService.getLikesByPostId(req.params.postId);
        if(!likes){
            throw (new NotFoundException("There are no likes on this post"));
        }
        return {"likes": likes};
    }

    @UseGuards(JwtAuthGuard)
    @Get('posts/:postId/likeIndex/:startIndex/:endIndex')
    // @MessagePattern("getLikesByIndex")
    async getLikesByIndex(@Request() req: any){
        let likes = await this.likeService.getLikesByPostIdAndPage(req.params.postId, req.params.startIndex, req.params.endIndex);
        if(!likes){
            throw (new NotFoundException("There are no likes on this post"));
        }
        return {"likes": likes};
    }

}
