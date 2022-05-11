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

  async singup(profilePicture: string, fullName: string, email: string, password: string, phone: string, userType:string) {
    try{
      const newUser = new this.userModel({
          profilePicture,
          fullName,
          email,
          password,
          phone,
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
      throw new RpcException(new NotFoundException("Invalid Token"));
    }
    return user;
  }

async updateUserObject(_id:string,userObj:any){
    let user = await this.userModel.findOneAndUpdate({_id},{$set:userObj},{new:true}).lean().exec();
    if(!user){
      throw new RpcException(new NotFoundException("Invalid Token"));
    }
    return user;
  }

  async incfollowerCount(userId:String){
    const post = await this.userModel.findOneAndUpdate({"_id":userId},{$inc :{'followerCount':1}},{new:true}).lean().exec();
    if(!post){
        throw new RpcException(new NotFoundException("There is no posts with this Id"));
    }
    else{
        return post;
    }
}

async decfollowerCount(userId:String){
  const post = await this.userModel.findOneAndUpdate({"_id":userId},{$inc :{'followerCount':-1}},{new:true}).lean().exec();
  if(!post){
      throw new RpcException(new NotFoundException("There is no posts with this Id"));
  }
  else{
      return post;
  }
}

async incfollowingCount(userId:String){
  const post = await this.userModel.findOneAndUpdate({"_id":userId},{$inc :{'followingCount':1}},{new:true}).lean().exec();
  if(!post){
      throw new RpcException(new NotFoundException("There is no posts with this Id"));
  }
  else{
      return post;
  }
}

async decfollowingCount(userId:String){
  const post = await this.userModel.findOneAndUpdate({"_id":userId},{$inc :{'followingCount':-1}},{new:true}).lean().exec();
  if(!post){
      throw new RpcException(new NotFoundException("There is no posts with this Id"));
  }
  else{
      return post;
  }
}

}