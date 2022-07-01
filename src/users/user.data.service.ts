import { Injectable, NotFoundException, NotAcceptableException, BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';

@Injectable()
export class UsersDataService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>
  ) {}

  async singup(profilePicture: string, fullName: string, email: string, password: string, phone: string, gender:string, userType:string) {
    try{
      const newUser = new this.userModel({
          profilePicture,
          fullName,
          email,
          password,
          phone,
          gender,
          userType
        });
        const result = await newUser.save();
        return result;
    }
    catch(err){
        return err
    }
  }

  async getUserByEmail(email: string) {
      try{
        const user = await this.userModel.findOne({ email: email }).lean().exec();
        return user
      }
      catch(err){
        return err
      }
  }

  async getUserPasswordByEmail(email: string) {
    try{
      const user = await this.userModel.findOne({ email: email }).select('+password').lean().exec();
      return user
    }
    catch(err){
      return err
    }
  }

  async getUserById(id: string) {
      try{
        const user = await this.userModel.findById(id).lean().exec();
        return user
      }
      catch(err){
        return err
      }
  }
  async getForgetPasswordToken(token:string){
      let user = await this.userModel.findOne({forgetPasswordToken:token}).lean().exec();
      if(!user){
        throw (new NotFoundException("Invalid Token"));
      }
      return user;
    }

  async updateUserObject(_id:string,userObj:any){
      let user = await this.userModel.findOneAndUpdate({_id},{$set:userObj},{new:true}).lean().exec();
      if(!user){
        throw (new NotFoundException("Invalid Token"));
      }
      return user;
  }

  async incTotalInternshipsCompletedCount(userId:String){
    const user = await this.userModel.findOneAndUpdate({"_id":userId},{$inc :{'totalInternshipsCompleted':1}},{new:true}).lean().exec();
    if(!user){
        throw (new NotFoundException("There is no user with this Id"));
    }
    else{
        return user;
    }
  }

  async incInternshipCreatedCount(userId:String){
    const user = await this.userModel.findOneAndUpdate({"_id":userId},{$inc :{'jobStats.internshipsCreated':1}},{new:true}).lean().exec();
    if(!user){
        throw (new NotFoundException("There is no user with this Id"));
    }
    else{
        return user;
    }
  }

  async incJobAppliedCount(userId:String){
    const user = await this.userModel.findOneAndUpdate({"_id":userId},{$inc :{'jobStats.applied':1}},{new:true}).lean().exec();
    if(!user){
        throw (new NotFoundException("There is no user with this Id"));
    }
    else{
        return user;
    }
  }
  
  async incJobShortlistCount(userId:String){
    const user = await this.userModel.findOneAndUpdate({"_id":userId},{$inc :{'jobStats.shortlisted':1}},{new:true}).lean().exec();
    if(!user){
        throw (new NotFoundException("There is no user with this Id"));
    }
    else{
        return user;
    }
  }

  async incJobCompletedCount(userId:String){
    const user = await this.userModel.findOneAndUpdate({"_id":userId},{$inc :{'jobStats.completed':1}},{new:true}).lean().exec();
    if(!user){
        throw (new NotFoundException("There is no user with this Id"));
    }
    else{
        return user;
    }
  }

  async incJobRecommandCount(userId:String){
    const user = await this.userModel.findOneAndUpdate({"_id":userId},{$inc :{'jobStats.recommanded':1}},{new:true}).lean().exec();
    if(!user){
        throw (new NotFoundException("There is no user with this Id"));
    }
    else{
        return user;
    }
  }

  async incManyJobRecommandCount(userIds: any): Promise<any>{
    const user = await this.userModel.updateMany({"_id": { $in: userIds } }, {$inc :{'jobStats.recommanded':1}},{new:true}).lean().exec();
    return user;
  }

  async incJobInterviewCount(userId:String){
    const user = await this.userModel.findOneAndUpdate({"_id":userId},{$inc :{'jobStats.interviewed':1}},{new:true}).lean().exec();
    if(!user){
        throw (new NotFoundException("There is no user with this Id"));
    }
    else{
        return user;
    }
  }

  async incfollowerCount(userId:String){
    const user = await this.userModel.findOneAndUpdate({"_id":userId},{$inc :{'followerCount':1}},{new:true}).lean().exec();
    if(!user){
        throw (new NotFoundException("There is no user with this Id"));
    }
    else{
        return user;
    }
  }

async decfollowerCount(userId:String){
  const user = await this.userModel.findOneAndUpdate({"_id":userId},{$inc :{'followerCount':-1}},{new:true}).lean().exec();
  if(!user){
      throw (new NotFoundException("There is no user with this Id"));
  }
  else{
      return user;
  }
}

async incfollowingCount(userId:String){
  const user = await this.userModel.findOneAndUpdate({"_id":userId},{$inc :{'followingCount':1}},{new:true}).lean().exec();
  if(!user){
      throw (new NotFoundException("There is no user with this Id"));
  }
  else{
      return user;
  }
}

async decfollowingCount(userId:String){
  const user = await this.userModel.findOneAndUpdate({"_id":userId},{$inc :{'followingCount':-1}},{new:true}).lean().exec();
  if(!user){
      throw (new NotFoundException("There is no user with this Id"));
  }
  else{
      return user;
  }
}

async getAllUsersByPage(userType: string, limit: number, skip: number){
  let users = await this.userModel.find({"userType": userType})
  .limit(limit)
  .skip(skip)
  .lean()
  .exec();
  return users
}

async getUsersCountByType(userType: string){
  let users = await this.userModel.countDocuments({"userType": userType}).exec();
  return users
}


}