import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersApprovalRequestDataService } from './usersApprovalRequest.data.service';
import { usersApprovalRequestDTO } from './usersApprovalRequest.dto';
import { UsersApprovalRequest } from './usersApprovalRequest.model';

@Injectable()
export class UsersApprovalRequestService {
    constructor(
        private readonly usersApprovalRequestDataService: UsersApprovalRequestDataService
    ) {}
    

    async insertUserRequest(userObj: any) {
        try{
            const newUser = this.usersApprovalRequestDataService.insertUserRequest(userObj);
            return newUser
        }
        catch(err){
            return err
        }
    }
    async getUserRequestByUserId(userId: string) {
        try{
        const user = await this.usersApprovalRequestDataService.getUserRequestByUserId(userId);
        return user
        }
        catch(err){
        return err
        }
    }
    async approveUserRequestByUserId(userId: string) {
        try{
        let user:usersApprovalRequestDTO = await this.usersApprovalRequestDataService.approveUserRequestByUserId(userId);
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
          const user = await this.usersApprovalRequestDataService.getAllUserRequest();
          return user
        }
        catch(err){
          return err
        }
    }

    async hello(str:string) {
        try{
          return str
        }
        catch(err){
          return err
        }
    }

}
