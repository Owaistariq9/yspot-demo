import { BadRequestException, forwardRef, HttpException, Inject, Injectable, NotFoundException, Post } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, RpcException, Transport } from '@nestjs/microservices';
import * as Joi from 'joi';
import { isValidObjectId } from 'mongoose';
import { FollowersService } from 'src/followers/followers.service';
import { InternshipsService } from 'src/internships/internships.service';
import { SearchService } from 'src/search/search.service';
import { UsersService } from 'src/users/user.service';
import { PostsDataService } from './posts.data.service';
import { postDTO, ResponseDTO } from './posts.dto';
import { PostsType } from './postsTypes.enum';
import { FCMService } from "src/fcm-provider/fcm.service";
import { FCM_Message } from 'src/core/constants/constants';

@Injectable()
export class PostsService {
    // private client: ClientProxy;
    constructor(private readonly postDataService: PostsDataService,
        private readonly fcmService: FCMService,
        private readonly userService: UsersService,
        private readonly followerService: FollowersService,
        @Inject(forwardRef(() => InternshipsService))
        private readonly internshipService: InternshipsService,
        private readonly searchService: SearchService
        ){
        // this.client = ClientProxyFactory.create({
        //     transport: Transport.TCP,
        //     options: {
        //       host: '127.0.0.1',
        //       port: 8878,
        //     },
        // });
    }
    
    async insertPost (postObj:postDTO){
        try{
            const newPost = await this.postDataService.insertPost(postObj);
            let esData = await this.searchService.insertPostData(newPost);
            // let esDataa = await this.searchService.getAllPostData();
            // let esDataa = await this.searchService.getPostData("sfFIyH0BJ6oVHwyah70d");
            return newPost;
        }
        catch(err){
            return err
        }
    }

    async verifyPollData (pollObj:any){
        const schema = Joi.object({
            questions: {
                responseCount: Joi.number(),
                serialNo: Joi.number().required(),
                type: Joi.string().required(),
                text: Joi.string().required(),
                options: Joi.array().items({
                    _id: Joi.string(),
                    responseCount: Joi.number(),
                    text: Joi.string().required(),
                    type: Joi.string().required(),
                })
            }
        })
        return schema.validate(pollObj);
    }

    async verifyEventData (eventObj:any){
        const schema = Joi.object({
            eventTitle: Joi.string().required(),
            url: Joi.string().required(),
            location: {},
            intrested: Joi.array().items({
                userId: Joi.string(),
                gender:Joi.string(),
                age:Joi.number(),
                fullName:Joi.string(),
                country:Joi.string(),
                city:Joi.string()
            })
        })
        return schema.validate(eventObj);
    }

    async verifySurveyData (surveyObj:any){
        const schema = Joi.object({
            responseCount: Joi.number(),
            questionsCount: Joi.number(),
            questions: Joi.array().items({
                serialNo: Joi.number().required(),
                type: Joi.string().required(),
                text: Joi.string().required(),
                options: Joi.array().items({
                    _id: Joi.string(),
                    text: Joi.string().required(),
                    type: Joi.string().required(),
                })
            })
        })
        return schema.validate(surveyObj);
    }

    async verifyContestData (contestObj:any){
        const schema = Joi.object({
            participantsCount: Joi.number(),
            contestTitle: Joi.string().required(),
            contestWinner: {
                userId: Joi.string(),
                contestResponseId: Joi.string(),
                fullName: Joi.string(),
                profilePicture: Joi.string()
            }
        })
        return schema.validate(contestObj);
    }

    async verifySurveyResponseData (responseObj:any){
        const schema = Joi.object({
            postId: Joi.string().required(),
            userId: Joi.string().required(),
            postType: Joi.string().required(),
            data: {
                userDetails: {
                    userId: Joi.string().required(),
                    gender:Joi.string().required(),
                    age:Joi.number().required(),
                    fullName:Joi.string().required(),
                    country:Joi.string().required(),
                    city:Joi.string().required()
                },
                answers: Joi.array().items({
                    question: Joi.string().required(),
                    selectedOptionId: Joi.string().required(),
                    selectedOptionText: Joi.string().required()
                })
            }
        })
        return schema.validate(responseObj);
    }

    async verifyPollResponseData (responseObj:any){
        const schema = Joi.object({
            postId: Joi.string().required(),
            userId: Joi.string().required(),
            postType: Joi.string().required(),
            data: {
                userDetails: {
                    userId: Joi.string().required(),
                    gender:Joi.string().required(),
                    age:Joi.number().required(),
                    fullName:Joi.string().required(),
                    country:Joi.string().required(),
                    city:Joi.string().required()
                },
                question: Joi.string().required(),
                selectedOptionId: Joi.string().required(),
                selectedOptionText: Joi.string().required()
            }
        })
        return schema.validate(responseObj);
    }

    async verifyContestResponseData (responseObj:any){
        const schema = Joi.object({
            postId: Joi.string().required(),
            userId: Joi.string().required(),
            postType: Joi.string().required(),
            data: {
                userDetails: {
                    userId: Joi.string().required(),
                    gender:Joi.string().required(),
                    age:Joi.number().required(),
                    fullName:Joi.string().required(),
                    country:Joi.string().required(),
                    city:Joi.string().required()
                },
                fileName: Joi.string(),
                description: Joi.string().required(),
                uploadFiles: Joi.array()
            }
        })
        return schema.validate(responseObj);
    }

    async verifyInternshipResponseData (responseObj:any){
        const schema = Joi.object({
            postId: Joi.string().required(),
            userId: Joi.string().required(),
            postType: Joi.string().required(),
            data: {
                userDetails: {
                    userId: Joi.string().required(),
                    gender:Joi.string().required(),
                    age:Joi.number().required(),
                    fullName:Joi.string().required(),
                    country:Joi.string().required(),
                    city:Joi.string().required()
                },
                status: Joi.string().required(),
                cvLink: Joi.string().required(),
                message: Joi.string().required(),
                email: Joi.string().email().required(),
                phone: Joi.number().required()
            }
        })
        return schema.validate(responseObj);
    }

    async updatePost(_id:string, postObj: postDTO){
        const post = await this.postDataService.updatePost(_id,postObj);
        const espost = await this.searchService.updatePostData(_id, postObj);
        if(!post){
            throw (new NotFoundException("There is no posts with this id"));
        }
        else{
            return post;
        }
    }

    async deletePost(postId:string){
        const post = await this.postDataService.deletePost(postId);
        const espost = await this.searchService.deletePostData(postId);
        if(!post){
            throw (new NotFoundException("There is no posts with this id"));
        }
        else{
            return post;
        }
    }

    async getAllUsersPosts(userId:string){
        const posts = await this.postDataService.getAllUsersPosts(userId);
        if(!posts[0]){
            throw (new NotFoundException("There is no posts for this user"));
        }
        else{
            return {"posts":posts};
        }
    }

    async getPostById(_id:string){
        const posts = await this.postDataService.getPostById(_id);
        if(!posts){
            throw (new NotFoundException("Invalid postId"));
        }
        else{
            return posts;
        }
    }

    async incCommentCountByPostId(postId:String){
        const post = await this.postDataService.incCommentCountByPostId(postId);
        const espost = await this.searchService.updatePostData(post._id, post);
        if(!post){
            throw (new NotFoundException("There is no posts with this Id"));
        }
        else{
            return post;
        }
    }

    async decCommentCountByPostId(postId:String){
        const post = await this.postDataService.decCommentCountByPostId(postId);
        const espost = await this.searchService.updatePostData(post._id, post);
        if(!post){
            throw (new NotFoundException("There is no posts with this Id"));
        }
        else{
            return post;
        }
    }

    async incLikeCountByPostId(postId:String){
        const post = await this.postDataService.incLikeCountByPostId(postId);
        const espost = await this.searchService.updatePostData(post._id, post);
        if(!post){
            throw (new NotFoundException("There is no posts with this Id"));
        }
        else{
            return post;
        }
    }

    async decLikeCountByPostId(postId:String){
        const post = await this.postDataService.decLikeCountByPostId(postId);
        const espost = await this.searchService.updatePostData(post._id, post);
        if(!post){
            throw (new NotFoundException("There is no posts with this Id"));
        }
        else{
            return post;
        }
    }

    async incPollCountByPostId(postId:String,pollOptionsId:String){
        let post:any = await this.postDataService.getPostById(postId);
        if(post.type !== PostsType.POLL){
            throw (new NotFoundException("There is no posts with this Id"));
        }
        else{
            post = await this.postDataService.incPollCountByPostId(postId);
            post = await this.postDataService.incPollOptionCountByPostId(postId,pollOptionsId);
            const espost = await this.searchService.updatePostData(post._id, post);
            return post;
        }
    }

    async incSurveyCountByPostId(postId:String){
        let post = await this.postDataService.getPostById(postId);
        if(post.type !== PostsType.SURVEY){
            throw (new NotFoundException("There is no posts with this Id"));
        }
        else{
            let updatedPost = await this.postDataService.incSurveyCount(postId);
            const espost = await this.searchService.updatePostData(post._id, post);
            return updatedPost;
        }
    }
    
    async addUserIntrestInEvent(postId:string, userId:string){
        if(!isValidObjectId(postId)){
            throw (new BadRequestException("Invalid postId"));
        }
        let check = await this.postDataService.checkUserIdInEvent(postId,userId);
        if(check){
            throw (new BadRequestException("This user is already intrested in this event"));
        }
        // let x = this.client.send<any>('profile',userId);
        // let data:any
        // await x.forEach ( x => {
        //     if(!x){
        //         throw (new BadRequestException("Invalid UserId"));
        //     }
        //     else if(x.status == 500){
        //         throw (new BadRequestException("Invalid UserId"));
        //     }
        //     else{
        //         data = x;
        //     }
        // })
        let userObj = await this.userService.getUserById(userId);
        // let userObj = {
        //     userId: data._id,
        //     fullName: data.fullName || "",
        //     gender: data.gender || "",
        //     age: data.age || "",
        //     country:data.country || "",
        //     city:data.city || ""
        // }
        const posts = await this.postDataService.updateIntrestedForEventByPostId(postId,userObj);
        const espost = await this.searchService.updatePostData(posts._id, posts);
        return {data: `${userObj.fullName} is intrested in ${postId}`};
    }

    async getNewsFeed(page:number,limit:number,userId:string){
        let skip = (page - 1) * limit;
        // let x = this.client.send<any>('profile',userId);
        // let data:any
        // await x.forEach ( x => {
        //     data = x;
        // })
        let data = await this.userService.getUserById(userId);
        let followerList = await this.followerService.getAllFollowers(userId);
        // let y = this.client.send<any>('getAllFollowers',userId);
        // let followerList:any
        // await y.forEach ( x => {
        //     followerList = x;
        // })
        // const posts = await this.postDataService.getPostByPage(skip,limit,data.age,data.country,data.gender, data.userRole, userId);
        // let followerList = ["618148168fff748826694e73"];
        const posts = await this.searchService.getNewsFeed(skip,limit,data.age,data.country,data.gender, data.userType, userId, followerList)
        // const posts = await this.searchService.test();
        return {"posts": posts.body?.hits?.hits || []};
    }

    async submitResponses(userId: string, responseObj: ResponseDTO){
        let checkResponse = await this.postDataService.getResponseByUserIdAndPostId(userId,responseObj.postId);
        if(checkResponse){
            throw (new BadRequestException("User already submitted response for this post"));
        }
        responseObj.userId = userId;
        let responseData;
        if(responseObj.postType == PostsType.POST){
            throw (new BadRequestException("Unable to submit response for this postType"));
        }
        else if(responseObj.postType == PostsType.EVENT){
            throw (new BadRequestException("Unable to submit response for this postType"));
        }
        else if(responseObj.postType == PostsType.POLL){
            let check:any = await this.verifyPollResponseData(responseObj);
            if(check.error){
                throw (new HttpException(check.error,400));
            }
            else{
                let post = await this.incPollCountByPostId(responseObj.postId,responseObj.data.selectedOptionId);
                responseData = await this.postDataService.insertResponse(responseObj);
            }
        }
        else if(responseObj.postType == PostsType.CONTEST){
            let check:any = await this.verifyContestResponseData(responseObj);
            if(check.error){
                throw (new HttpException(check.error,400));
            }
            else{
                let post = await this.postDataService.incContestCount(responseObj.postId);
                responseData = await this.postDataService.insertResponse(responseObj);
            }
        }
        else if(responseObj.postType == PostsType.SURVEY){
            let check:any = await this.verifySurveyResponseData(responseObj);
            if(check.error){
                throw (new HttpException(check.error,400));
            }
            else{
                let post = await this.incSurveyCountByPostId(responseObj.postId);
                responseData = await this.postDataService.insertResponse(responseObj);
            }
        }
        else if(responseObj.postType == PostsType.INTERNSHIP){
            let check:any = await this.verifyInternshipResponseData(responseObj);
            if(check.error){
                throw (new HttpException(check.error,400));
            }
            else{
                responseData = await this.postDataService.insertResponse(responseObj);
                const internshipData: any = await this.internshipService.incResponseCountByPostId(responseObj.postId);
                const userData = await this.userService.incJobAppliedCount(userId);
                const businessUserData = await this.userService.incJobAppliedCount(internshipData.userId);
                await this.internshipService.insertUserInternship(responseData.postId, userId, internshipData.userId);
                await this.internshipService.updateDemographicsByAgeAndGender(responseObj.postId, userData.age, userData.gender);
                const notification: any = {
                    Notification:{
                    data:{},
                    notification: {
                      title: FCM_Message.APPLYING_INTERNSHIP().title,
                      body: FCM_Message.APPLYING_INTERNSHIP().body,
                    }},
                    UserId: internshipData.userId,
                  };
                await this.fcmService.sendNotification(notification)
            }
        }
        else{
            throw (new BadRequestException("Invalid postType"));
        }
        let userResponse = await this.postDataService.getUserResponse(userId);
        if(!userResponse){
            let userResponseObj = {
                _id: userId,
                responseIds: [responseData._id]
            }
            let newUserResponse = await this.postDataService.insertUserResponse(userResponseObj);
        }
        else{
            let newUserResponse = await this.postDataService.addUserResponse(userId, responseData._id);
        }
        return responseData;
    }

    // async addInternshipResponse(responseObj: any, userId:string){
    //     let checkResponse = await this.postDataService.getResponseByUserIdAndPostId(userId,responseObj.postId);
    //     if(checkResponse){
    //         throw (new BadRequestException("User already submitted response for this internship"));
    //     }
    //     responseObj.userId = userId;
    //     let responseData: any;
    //     if(responseObj.postType != "internship"){
    //         throw (new BadRequestException("postType should be internship"));
    //     }
    //     let check:any = await this.verifyInternshipResponseData(responseObj);
    //     if(check.error){
    //         throw (new HttpException(check.error,400));
    //     }
    //     responseData = await this.postDataService.insertResponse(responseObj);
    //     let userResponse = await this.postDataService.getUserResponse(userId);
    //     if(!userResponse){
    //         let userResponseObj = {
    //             _id: userId,
    //             responseIds: [responseData._id]
    //         }
    //         let newUserResponse = await this.postDataService.insertUserResponse(userResponseObj);
    //     }
    //     else{
    //         let newUserResponse = await this.postDataService.addUserResponse(userId, responseData._id);
    //     }
    //     return responseData;
    // }

    async getPostResponses(postId: string , page:number, limit:number){
        let skip = (page - 1) * limit;
        return {"data": await this.postDataService.getPostResponses(postId, skip, limit)}
    }

    async getInternshipResponsesByStatus(postId: string, status:string, page:number, limit:number){
        let skip = (page - 1) * limit;
        return {"data": await this.postDataService.getInternshipResponsesByStatus(postId, status, skip, limit)}
    }

    async getInternshipResponses(postId: string, page:number, limit:number){
        let skip = (page - 1) * limit;
        return {"data": await this.postDataService.getInternshipResponses(postId, skip, limit)}
    }

    async getInternshipResponseByUserIdAndPostId(postId: string, userId:string){
        return await this.postDataService.getResponseByUserIdAndPostId(userId, postId)
    }

    async updateInternshipResponseStatus(_id: string, status: string, userId: string, currentUserId: string){
        let notification: any = {};
        let userNotification: any = {}
        userNotification.userId = userId;
        if(status === "interviewed"){
            const userData = await this.userService.incJobInterviewCount(userId);
            await this.userService.incJobInterviewCount(currentUserId);
            notification = {
                Notification:{
                data:{},
                notification: {
                  title: FCM_Message.UPDATE_INTERVIEW_INTERNSHIP_STATUS().title,
                  body: FCM_Message.UPDATE_INTERVIEW_INTERNSHIP_STATUS().body,
                }},
                UserId: userId,
            };            
            userNotification.title = FCM_Message.UPDATE_INTERVIEW_INTERNSHIP_STATUS().title;
            userNotification.message = FCM_Message.UPDATE_INTERVIEW_INTERNSHIP_STATUS().body;
        }
        else if(status === "hired"){
            const userData = await this.userService.incJobShortlistCount(userId);
            await this.userService.incJobShortlistCount(currentUserId);
            notification = {
                Notification:{
                data:{},
                notification: {
                  title: FCM_Message.UPDATE_HIRED_INTERNSHIP_STATUS().title,
                  body: FCM_Message.UPDATE_HIRED_INTERNSHIP_STATUS().body,
                }},
                UserId: userId,
            };
            userNotification.title = FCM_Message.UPDATE_HIRED_INTERNSHIP_STATUS().title;
            userNotification.message = FCM_Message.UPDATE_HIRED_INTERNSHIP_STATUS().body;
        }
        else if(status === "completed"){
            const userData = await this.userService.incJobCompletedCount(userId);
            await this.userService.incJobCompletedCount(currentUserId);
            notification = {
                Notification:{
                data:{},
                notification: {
                  title: FCM_Message.COMPLETED().title,
                  body: FCM_Message.COMPLETED().body,
                }},
                UserId: userId,
            };
            userNotification.title = FCM_Message.COMPLETED().title;
            userNotification.message = FCM_Message.COMPLETED().body;
        }
      
        await this.fcmService.sendNotification(notification)

        return await this.postDataService.updateInternshipResponseStatus(_id, status);
    }

    async getUserInternshipResponses(userId: string, page:number, limit:number){
        let skip = (page - 1) * limit;
        return {"data": await this.postDataService.getUserResponsesByPostType(userId, PostsType.INTERNSHIP, skip, limit)}
    }

    async getUserResponses(userId: string, startIndex:number, endIndex:number ){
        return {"data": await this.postDataService.getUserResponses(userId, startIndex, endIndex)}
    }
    async updateContestWinner (postId:String, winnerObj:any){
        let post:any = await this.postDataService.getPostById(postId);
        if(post.type !== PostsType.CONTEST){
            throw (new BadRequestException("This post type is not contest"));
        }
        post.data.contestWinner = winnerObj;
        let check = await this.verifyContestData(post.data);
        if(check.error){
            throw (new HttpException(check.error,400));
        }
        const posts = await this.postDataService.updateContestWinner(postId,winnerObj);
        const espost = await this.searchService.updatePostData(posts._id, posts);
        return {data: `${winnerObj.fullName} is winner of ${postId}`};
    }
}
