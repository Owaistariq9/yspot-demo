import { Injectable, NotFoundException, NotAcceptableException, BadRequestException, ConsoleLogger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model, Types } from 'mongoose';
import { Notification } from './notification.model';

@Injectable()
export class NotificationsDataService {
  constructor(
    @InjectModel('Notification') private readonly notificationModel: Model<Notification>
  ) {}

  async getUsersTokens(userIds:string[]){
    let userObjIds :ObjectId[] = userIds.map(item=>new Types.ObjectId(item))
    let result = await this.notificationModel.aggregate([
      {$match:{$expr:{ $in:["$userId",userObjIds  ] }}}, 
      {$group:{
      _id:null,
      token:{$push:"$notificationTokens.deviceId"}
      
      }},
      
      
      {
            $project: {
              "tokens": {
                $reduce: {
                  input: '$token',
                  initialValue: [],
                  in: {$concatArrays: ['$$value', '$$this']}
                }
              }
            }
          }
          
      
      ])
      if(result.length >0){
        return result[0].tokens
      }
      return []
  }




async create(obj) {
  try{
    const newNotification = new this.notificationModel(obj);
      const result = await newNotification.save();
      return result;
  }
  catch(err){
      return err
  }
}

async getNotificationByEmail(email: string) {
    try{
      const user = await this.notificationModel.findOne({ email: email }).lean().exec();
      return user
    }
    catch(err){
      return err
    }
}

async pushNotificationTokens(userId:String, notificationTokens:any):Promise<boolean>{
  const result = await this.notificationModel.findOneAndUpdate({userId:userId},{$push:{notificationTokens:notificationTokens}},{new:true}).lean().exec();
  console.log(result,'result')
  if(!result){
    return false
  }
  else{
      return true
  }
}
async getNotificationById(id: string) {
    try{
      let userId:any = new Types.ObjectId(id)
      const user = await this.notificationModel.findOne({userId:userId }).lean().exec();
      return user
    }
    catch(err){
      return err
    }
}
async getForgetPasswordToken(token:string){
    let user = await this.notificationModel.findOne({forgetPasswordToken:token}).lean().exec();
    if(!user){
      throw (new NotFoundException("Invalid Token"));
    }
    return user;
  }

async updateNotificationObject(_id:string,userObj:any){
    let user = await this.notificationModel.findOneAndUpdate({_id},{$set:userObj},{new:true}).lean().exec();
    if(!user){
      throw (new NotFoundException("Invalid Token"));
    }
    return user;
  }

}