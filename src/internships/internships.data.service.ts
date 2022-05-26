import { Injectable, NotFoundException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Internships } from "./models/internships.model";
import { Recommands } from "./models/recommands.model";

@Injectable()
export class InternshipsDataService {
    constructor(
        @InjectModel('Internships') private readonly InternshipModel: Model<Internships>,
        @InjectModel('Recommands') private readonly RecommandModel: Model<Recommands>
    ) {}

    async insertInternships (obj: any){
        try{
            const internships = new this.InternshipModel(obj);
            await internships.save();
            return internships.toObject();
        }
        catch(err){
            return err
        }
    }

    async insertRecommands (obj: any){
        try{
            const recommands = new this.RecommandModel(obj);
            await recommands.save();
            return recommands.toObject();
        }
        catch(err){
            return err
        }
    }

    async insertManyRecommands (arr: any){
        try{
            const recommands = await this.RecommandModel.insertMany(arr);
            return recommands;
        }
        catch(err){
            return err
        }
    }

    async getRecommands (internshipId: string, recommandedBy: string, recommandedTo: string){
        const recommands = await this.RecommandModel.findOne( { $and:[ { "internshipId": internshipId }, {"recommandedBy": recommandedBy}, {"recommandedTo": recommandedTo}  ] } ).lean().exec();
        if(!recommands){
            return null
        }
        else{
            return recommands;
        }
    }

    async getExistingRecommandations (internshipId: string, recommandedToIds: any){
        const recommands = await this.RecommandModel.find( { $and: [ { "internshipId": internshipId }, {"recommandedTo": { $in: recommandedToIds } }  ] } ).lean().exec();
        return recommands;
    }

    async getUserRecommandations (recommandedTo: string, limit:number, skip:number){
        return await this.RecommandModel.find({"recommandedTo": recommandedTo}).limit(limit).skip(skip).sort('-createdAt').lean().exec();
    }

    async getUserInternshipsByIdList (arr: any){
        return await this.InternshipModel.find( {"_id": { $in: arr } } ).lean().exec();
    }

    async updateInternship(_id:string, internshipObj: any){
        const internship = await this.InternshipModel.findOneAndUpdate({_id},{$set:internshipObj},{new:true}).lean().exec();
        if(!internship){
            throw (new NotFoundException("There is no internship with this id"));
        }
        else{
            return internship;
        }
    }

    async deleteInternship(id:string){
        const internship = await this.InternshipModel.findByIdAndDelete({"_id":id}).lean().exec();
        if(!internship){
            throw (new NotFoundException("There is no internship with this id"));
        }
        else{
            return internship;
        }
    }

    async getAllUsersInternship(userId:string, limit:number, skip:number){
        const internship = await this.InternshipModel.find({"userId":userId}).limit(limit).skip(skip).sort('-createdAt').lean().exec();
        // if(!internship[0]){
        //     throw (new NotFoundException("There is no internship of this user"));
        // }
        // else{
        //     return internship;
        // }
        return internship;
    }

    async getInternshipById(_id:String){
        const internship = await this.InternshipModel.findById(_id).lean().exec();
        if(!internship){
            throw (new NotFoundException("Invalid internshipId"));
        }
        else{
            return internship;
        }
    }

    async incCommentCountByInternshipId(internshipId:String){
        const post = await this.InternshipModel.findOneAndUpdate({"_id": internshipId}, {$inc :{'commentsCount':1}},{new:true}).lean().exec();
        if(!post){
            throw (new NotFoundException("There is no posts with this Id"));
        }
        else{
            return post;
        }
    }
    

    async decCommentCountByInternshipId(internshipId:String){
        const post = await this.InternshipModel.findOneAndUpdate({"_id": internshipId},{$inc :{'commentsCount': -1}},{new:true}).lean().exec();
        if(!post){
            throw (new NotFoundException("There is no posts with this Id"));
        }
        else{
            return post;
        }
    }

    async incRecommandCountByInternshipId(internshipId:String){
        const post = await this.InternshipModel.findOneAndUpdate({"_id": internshipId}, {$inc :{'recommandCount':1}},{new:true}).lean().exec();
        if(!post){
            throw (new NotFoundException("There is no posts with this Id"));
        }
        else{
            return post;
        }
    }

    async decRecommandCountByInternshipId(internshipId:String){
        const post = await this.InternshipModel.findOneAndUpdate({"_id": internshipId},{$inc :{'recommandCount': -1}},{new:true}).lean().exec();
        if(!post){
            throw (new NotFoundException("There is no posts with this Id"));
        }
        else{
            return post;
        }
    }

    async incViewCountByInternshipId(internshipId:String){
        const post = await this.InternshipModel.findOneAndUpdate({"_id": internshipId}, {$inc :{'viewCount':1}},{new:true}).lean().exec();
        if(!post){
            throw (new NotFoundException("There is no posts with this Id"));
        }
        else{
            return post;
        }
    }

    async decViewCountByInternshipId(internshipId:String){
        const post = await this.InternshipModel.findOneAndUpdate({"_id": internshipId},{$inc :{'viewCount': -1}},{new:true}).lean().exec();
        if(!post){
            throw (new NotFoundException("There is no posts with this Id"));
        }
        else{
            return post;
        }
    }

    async incResponseCountByInternshipId(internshipId:String){
        const post = await this.InternshipModel.findOneAndUpdate({"_id": internshipId}, {$inc :{'responseCount':1}},{new:true}).lean().exec();
        if(!post){
            throw (new NotFoundException("There is no posts with this Id"));
        }
        else{
            return post;
        }
    }

    async getFilteredInternships (industry: string, expLevel: string, country: string, limit: number, skip: number, sort: string){
        return await this.RecommandModel.find({ $and: [
            {
                "industry": industry
            },
            {
                "country": country
            },
            {
                "expLevel": expLevel
            }
        ]}).limit(limit).skip(skip).sort(sort).lean().exec();
    }
    
}