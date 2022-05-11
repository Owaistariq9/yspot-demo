import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Constants } from 'src/core/constants/constants';
import { usersApprovalRequestDTO } from './usersApprovalRequest.dto';
import { UsersApprovalRequest } from './usersApprovalRequest.model';

@Injectable()
export class UsersApprovalRequestDataService {
    constructor(
        @InjectModel('UsersApprovalRequest') private readonly UsersApprovalRequestsModel: Model<UsersApprovalRequest>
    ) {}

    async insertUserRequest(userObj: any) {
        try{
            const newUser = new this.UsersApprovalRequestsModel(userObj);
            const result = await newUser.save();
            return result._id as string;
        }
        catch(err){
            return err
        }
    }
    async getUserRequestByUserId(userId: string) {
        try{
        const user = await this.UsersApprovalRequestsModel.findOne({ userId: userId }).lean().exec();
        return user
        }
        catch(err){
        return err
        }
    }

    async approveUserRequestByUserId(userId: string) {
        try{
        let user:usersApprovalRequestDTO = await this.UsersApprovalRequestsModel.findOneAndUpdate(
            { userId: userId },
            {$set: {status:Constants.approved}},
            {new: true}
        );
        if(!user){
            return null;
        }
        return user;
        }
        catch(err){
        return err
        }
    }

    async getAllUserRequest() {
        try{
          const user = await this.UsersApprovalRequestsModel.find().lean().exec();
          return user
        }
        catch(err){
          return err
        }
    }
}