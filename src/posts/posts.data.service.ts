import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './models/posts.model';
import { Response } from './models/post.response.model';
import { UserResponse } from './models/post.userResponse.model';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PostsDataService {
    constructor(
        @InjectModel('Post') private readonly postModel: Model<Post>,
        @InjectModel('Responses') private readonly responseModel: Model<Response>,
        @InjectModel('UserResponses') private readonly userResponseModel: Model<UserResponse>
    ) {}

    async insertPost (postObj){
        try{
            const newPost = new this.postModel(postObj);
            await newPost.save();
            return newPost.toObject();
        }
        catch(err){
            return err
        }
    }

    async updatePost(_id:string, postObj: any){
        const post = await this.postModel.findOneAndUpdate({_id},{$set:postObj},{new:true}).lean().exec();
        if(!post){
            throw (new NotFoundException("There is no posts with this id"));
        }
        else{
            return post;
        }
    }

    async deletePost(postId:string){
        const post = await this.postModel.findByIdAndDelete({"_id":postId}).lean().exec();
        if(!post){
            throw (new NotFoundException("There is no posts with this id"));
        }
        else{
            return post;
        }
    }
    
    async getAllUsersPosts(userId:string){
        const posts = await this.postModel.find({"userId":userId}).lean().exec();
        if(!posts[0]){
            throw (new NotFoundException("There is no posts of this user"));
        }
        else{
            return posts;
        }
    }

    async getPostById(_id:String){
        const posts = await this.postModel.findById(_id).lean().exec();
        if(!posts){
            throw (new NotFoundException("Invalid postId"));
        }
        else{
            return posts;
        }
    }

    async incCommentCountByPostId(postId:String){
        const post = await this.postModel.findOneAndUpdate(postId,{$inc :{'commentsCount':1}},{new:true}).lean().exec();
        if(!post){
            throw (new NotFoundException("There is no posts with this Id"));
        }
        else{
            return post;
        }
    }

    async decCommentCountByPostId(postId:String){
        const post = await this.postModel.findOneAndUpdate(postId,{$inc :{'commentsCount': -1}},{new:true}).lean().exec();
        if(!post){
            throw (new NotFoundException("There is no posts with this Id"));
        }
        else{
            return post;
        }
    }

    async incLikeCountByPostId(postId:String){
        const post = await this.postModel.findOneAndUpdate(postId,{$inc :{'likesCount':1}},{new:true}).lean().exec();
        if(!post){
            throw (new NotFoundException("There is no posts with this Id"));
        }
        else{
            return post;
        }
    }

    async decLikeCountByPostId(postId:String){
        const post = await this.postModel.findOneAndUpdate(postId,{$inc :{'likesCount': -1}},{new:true}).lean().exec();
        if(!post){
            throw (new NotFoundException("There is no posts with this Id"));
        }
        else{
            return post;
        }
    }

    async incPollCountByPostId(postId:String){
        const post = await this.postModel.findOneAndUpdate(postId,{$inc :{'data.questions.responseCount':1}},{new:true}).lean().exec();
        if(!post){
            throw (new NotFoundException("There is no posts with this Id"));
        }
        else{
            return post;
        }
    }

    async incPollOptionCountByPostId(postId:String, pollOptionId:String){
        const post = await this.postModel.findOneAndUpdate({postId,"data.questions.options._id":pollOptionId},{$inc :{'data.questions.options.$.responseCount':1}},{new:true}).lean().exec();
        if(!post){
            throw (new NotFoundException("There is no posts with this Id"));
        }
        else{
            return post;
        }
    }

    async incSurveyCount(postId){
        let post = await this.postModel.findByIdAndUpdate(postId,{$inc: {"data.responseCount":1}},{new:true}).lean().exec();
        if(!post){
            throw (new NotFoundException("There is no posts with this Id"));
        }
        else{
            return post;
        }
    }

    async incContestCount(postId){
        let post = await this.postModel.findByIdAndUpdate(postId,{$inc: {"data.participantsCount":1}},{new:true}).lean().exec();
        if(!post){
            throw (new NotFoundException("There is no posts with this Id"));
        }
        else{
            return post;
        }
    }

    async updateIntrestedForEventByPostId(postId:String, userObj:any){
        const posts = await this.postModel.findOneAndUpdate({"_id":postId},{$push:{"data.interested":userObj}},{new:true}).lean().exec();
        if(!posts){
            throw (new NotFoundException("There is no posts with this Id"));
        }
        else{
            // return {data: `${userObj.fullName} is intrested in ${postId}`};
            return posts;
        }
    }

    async updateContestWinner(postId:String, postObj:any){
        const posts = await this.postModel.findOneAndUpdate({"_id":postId},{$set:postObj},{new:true}).lean().exec();
        if(!posts){
            throw (new NotFoundException("There is no posts with this Id"));
        }
        else{
            // return {data: `${postObj.fullName} is winner of ${postId}`};
            return posts;
        }
    }

    async checkUserIdInEvent(postId:String, userId:String){
        const posts = await this.postModel.findOne({$and:[{"_id":postId},{"data.interested":{$elemMatch:{"userId":userId}}}]}).lean().exec();
        if(posts){
            throw (new BadRequestException("This user is already intrested in this event"));
        }
        else{
            return null;
        }
    }
    
    async getPostByPage (skip:number, limit:number, age:number, country:string, gender:string,userRole:string,userId: string){
        const posts = await this.postModel.find({$and: [
            {
                $or: [
                {
                    $and: [
                        {"privacyFilter.startAge": 0},
                        {"privacyFilter.endAge": 0},
                    ]
                },
                {
                    $and: [
                        {"privacyFilter.startAge": { $lte: age } },
                        {"privacyFilter.endAge": { $gte: age } },
                    ]
                }
                ]
            },
            {
                $or: [
                    { "privacyFilter.countries.0": { "$exists": false }},
                    { "privacyFilter.countries" : country }
                ]
            },
            {
                $or: [
                    { "privacyFilter.gender": "both"},
                    { "privacyFilter.gender" : gender }
                ]
            },
            {
                $or: [
                    { "privacyFilter.visibility" : "public" },
                    { "privacyFilter.visibility": userRole},
                    {
                        $and: [
                            {
                                $or: [
                                    { "privacyFilter.visibility" : "followersOnly" },
                                    { "privacyFilter.visibility" : "private" }
                                ]
                            },
                            { "privacyFilter.users": userId}
                        ]
                    }
                ]
            }
        
        ]}).limit(limit).skip(skip).sort('-createdAt').lean().exec();
        if(!posts[0]){
            throw (new NotFoundException("Unable to find posts"));
        }
        else{
            return posts;
        }
    }

    async insertResponse(responseObj){
        try{
            const newPost = new this.responseModel(responseObj);
            await newPost.save();
            return newPost;
        }
        catch(err){
            return err
        }
    }

    async getResponseByUserIdAndPostId(userId:String, postId:String){
        const response = await this.responseModel.findOne({$and: [ {"userId": userId}, {"postId": postId} ] }).lean().exec();
        if(!response){
            return null
        }
        else{
            return response;
        }
    }

    async insertUserResponse(responseObj){
        try{
            const newPost = new this.userResponseModel(responseObj);
            await newPost.save();
            return newPost;
        }
        catch(err){
            return err
        }
    }

    async getUserResponse(userId:String){
        const posts = await this.userResponseModel.findOne({"_id" :userId}).lean().exec();
        return posts;
    }

    async addUserResponse(userId:String, responseId:String){
        const posts = await this.userResponseModel.findOneAndUpdate({"_id":userId},{$push:{"responseIds":responseId}},{new:true}).lean().exec();
        if(!posts){
            throw (new NotFoundException("There is no posts with this Id"));
        }
        else{
            return true;
        }
    }

    async updateInternshipResponseStatus(_id:string, status:string){
        const internship = await this.responseModel.findOneAndUpdate({"_id":_id}, {$set: {"data.status": status}},{new:true}).lean().exec();
        if(!internship){
            throw (new NotFoundException("There is no internship with this Id"));
        }
        else{
            // return {data: `${postObj.fullName} is winner of ${postId}`};
            return internship;
        }
    }

    async getPostResponses(postId: string , page:number, limit:number){
        let postResponses = await this.responseModel.find({postId:postId})
        .limit(limit)
        .skip(page)
        .sort('-createdAt')
        .lean()
        .exec();
        if(postResponses.length > 0){
            return postResponses;
        }
        else{
            throw (new NotFoundException("Unable to find posts"));
        }
    }

    async getUserResponsesByPostType(userId: string, postType:string, page:number, limit:number){
        let postResponses = await this.responseModel.find({$and: [ {"userId": userId}, {"postType": postType} ] })
        .limit(limit)
        .skip(page)
        .sort('-createdAt')
        .lean()
        .exec();
        if(postResponses.length > 0){
            return postResponses;
        }
        else{
            throw (new NotFoundException("Unable to find posts"));
        }
    }

    async getInternshipResponsesByStatus(postId: string, status:string, skip:number, limit:number){
        let postResponses = await this.responseModel.find({$and: [ {"postId": postId}, {"data.status": status} ] })
        .limit(limit)
        .skip(skip)
        .sort('-createdAt')
        .lean()
        .exec();
        if(postResponses.length > 0){
            return postResponses;
        }
        else{
            throw (new NotFoundException("Unable to find posts"));
        }
    }

    async getInternshipResponses(postId: string, skip:number, limit:number){
        let postResponses = await this.responseModel.find( { $and: [ {"postId": postId}, { $or: [ {"data.status": "interview"}, {"data.status": "hired"} ] } ] } )
        .limit(limit)
        .skip(skip)
        .sort('-createdAt')
        .lean()
        .exec();
        if(postResponses.length > 0){
            return postResponses;
        }
        else{
            throw (new NotFoundException("Unable to find posts"));
        }
    }
    
    async getUserResponses(userId: string, startIndex:number, endIndex:number){
        return await this.userResponseModel.findOne({"_id":userId}).slice("responseIds",[+startIndex,+endIndex]);
    }
}