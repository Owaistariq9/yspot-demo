import { BadRequestException, Body, Controller, Delete, Get, HttpException, Param, Patch, Post, Put, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { postDTO, ResponseDTO} from './posts.dto';
import { PostsService } from './posts.service';
import { PostsType } from './postsTypes.enum';
import { ObjectId } from 'mongodb';
import { Constants } from 'src/core/constants/constants';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller('posts')
export class PostsController {
    constructor(private readonly postService:PostsService){}

    @UseGuards(JwtAuthGuard)
    @Post()
    // @MessagePattern("createPost")
    async createPost(@Request() req:any,
    @Body() postObj:postDTO){
        // let postObj = req.body;
        postObj.userId = req.user._id;
        if(postObj.type == PostsType.POST){
            let post = await this.postService.insertPost(postObj);
            return { "postId": post._id} ;
        }
        if(req.user.userClaims.userType !== Constants.business){
            throw (new UnauthorizedException("Youth can only create normal posts"));
        }
        else if(postObj.type == PostsType.POLL){
            postObj.data.questions.responseCount = 0;
            let check = await this.postService.verifyPollData(postObj.data);
            if(check.error){
                throw (new HttpException(check.error,400));
            }
            else{
                for(let i=0;i<postObj.data.questions.options.length;i++){
                    let val = new ObjectId();
                    postObj.data.questions.options[i]._id = val.toString()
                    postObj.data.questions.options[i].responseCount = 0;
                }
                let post = await this.postService.insertPost(postObj);
                return { "postId": post._id} ;
            }
        }
        else if(postObj.type == PostsType.EVENT){
            postObj.data.interested = [];
            let check = await this.postService.verifyEventData(postObj.data);
            if(check.error){
                throw (new HttpException(check.error,400));
            }
            else{
                let post = await this.postService.insertPost(postObj);
                return { "postId": post._id} ;
            }
        }
        else if(postObj.type == PostsType.SURVEY){
            postObj.data.responseCount = 0;
            postObj.data.questionsCount = 0;
            let check = await this.postService.verifySurveyData(postObj.data);
            if(check.error){
                throw (new HttpException(check.error,400));
            }
            else{
                postObj.data.questions.forEach(x => {
                    postObj.data.questionsCount++;
                    x.options.forEach( y => {
                        let val = new ObjectId();
                        y._id = val.toString();
                    })
                })
                let post = await this.postService.insertPost(postObj);
                return { "postId": post._id} ;
            }
        }
        else if(postObj.type == PostsType.CONTEST){
            postObj.data.participantsCount = 0;
            let check = await this.postService.verifyContestData(postObj.data);
            if(check.error){
                throw (new HttpException(check.error,400));
            }
            else{
                let post = await this.postService.insertPost(postObj);
                return { "postId": post._id} ;
            }
        }
        // else if(postObj.type == PostsType.CONTEST){
        //     postObj.data.participantsCount = 0;
        //     let check = await this.postService.verifyContestData(postObj.data);
        //     if(check.error){
        //         throw (new HttpException(check.error,400));
        //     }
        //     else{
        //         let post = await this.postService.insertPost(postObj);
        //         return { "postId": post._id} ;
        //     }
        // }
        else if(postObj.type == PostsType.CAMPAIGN){
            let post = await this.postService.insertPost(postObj);
            return { "postId": post._id} ;
        }
        else if(postObj.type == PostsType.BRAND_POST){
            let post = await this.postService.insertPost(postObj);
            return { "postId": post._id} ;
        }
        else{
            throw (new BadRequestException("Invalid post type"));
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    // @MessagePattern("getAllUsersPosts")
    async getAllUsersPosts(@Request() req:any){
        let posts = await this.postService.getAllUsersPosts(req.user._id);
        return posts;
    }
    
    @Get('/:postId')
    // @MessagePattern("getPostById")
    async getPostById(@Request() req:any){
        let posts = await this.postService.getPostById(req.params.postId);
        return posts;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':postId')
    // @MessagePattern("deletePost")
    async deletePost(@Request() req:any){
        let userId = req.user._id;
        let post = await this.postService.getPostById(req.params.postId);
        if(post.userId !== userId){
            throw (new BadRequestException("This post cannot be deleted by this user."));
        }
        let deletedPost = await this.postService.deletePost(req.params.postId);
        return "Deleted post with postId " + post._id ;
    }

    @UseGuards(JwtAuthGuard)
    @Put(':postId')
    // @MessagePattern("updatePost")
    async updatePost(@Request() req:any){
        let userId = req.user._id;
        let post = await this.postService.getPostById(req.params.postId);
        let postObj:postDTO = req.body;
        if(post.userId !== userId){
            throw (new BadRequestException("This post cannot be updated by this user."));
        }
        let updatedPost = await this.postService.updatePost(req.params.postId, postObj);
        return updatedPost;
    }

    @UseGuards(JwtAuthGuard)
    @Put(':postId/interest')
    // @MessagePattern("userIntrestedInEvent")
    async userIntrestedInEvent(@Request() req:any){
        let updatedPost = await this.postService.addUserIntrestInEvent(req.params.postId,req.user._id);
        return updatedPost;
    }

    @UseGuards(JwtAuthGuard)
    @Get('newsFeed/:page/:limit')
    // @MessagePattern("newsFeed")
    async newsFeed(@Request() req:any){
        let newsFeed = await this.postService.getNewsFeed(req.params.page,req.params.limit,req.user._id);
        return newsFeed;
    }

    @UseGuards(JwtAuthGuard)
    @Get('responses/:startIndex/:endIndex')
    // @MessagePattern("getUserResponses")
    async getUserResponses(@Request() req:any){
        return this.postService.getUserResponses(req.user._id,req.params.startIndex,req.params.endIndex);
    }

    @UseGuards(JwtAuthGuard)
    @Get('responses/internships/:startIndex/:endIndex')
    // @MessagePattern("getUserInternshipResponses")
    async getUserInternshipResponses(@Request() req:any){
        return this.postService.getUserInternshipResponses(req.user._id,req.params.startIndex,req.params.endIndex);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':postId/response')
    // @MessagePattern("submitResponse")
    async submitResponse(@Request() req:any,
    @Body() responseObj:ResponseDTO){
        responseObj.postId = req.params.postId;
        return this.postService.submitResponses(req.user._id,responseObj);
    }

    
    @UseGuards(JwtAuthGuard)
    @Get(':postId/response/:page/:limit')
    // @MessagePattern("getPostResponses")
    async getPostResponses(@Request() req:any){
        if(req.user.userClaims.userType === Constants.user){
            return (new UnauthorizedException("Youth not allowed to see responses"));
        }else{
            return this.postService.getPostResponses(req.params.postId,req.params.page,req.params.limit);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get(':postId/response/:status/:page/:limit')
    // @MessagePattern("getPostResponses")
    async getPostResponsesByStatus(@Request() req:any){
        if(req.user.userClaims.userType === Constants.user){
            return (new UnauthorizedException("Youth not allowed to see responses"));
        }else{
            if(req.params.status === "applied"){
                return this.postService.getInternshipResponsesByStatus(req.params.postId, req.params.status, req.params.page, req.params.limit);
            }
            else{
                return this.postService.getInternshipResponses(req.params.postId, req.params.page, req.params.limit);
            }
        }
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/response/:id/:status')
    // @MessagePattern("getPostResponses")
    async updateInternshipResponseStatus(@Request() req:any){
        if(!req.body.userId){
            return (new BadRequestException("userId Required!"));
        }
        if(req.user.userClaims.userType === Constants.user){
            return (new UnauthorizedException("Youth not allowed to see responses"));
        }else{
            return this.postService.updateInternshipResponseStatus(req.params.id,req.params.status, req.body.userId);
        }
    }
    
   
    @UseGuards(JwtAuthGuard)
    @Put(':postId/winner')
    // @MessagePattern("updateContestWinner")
    async updateContestWinner(@Request() req:any){
        if(req.user.userClaims.userType !== Constants.business){
            throw (new UnauthorizedException("This feature is for business accounts only"));
        }
        return this.postService.updateContestWinner(req.params.postId,req.body);
    }

}
