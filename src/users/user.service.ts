import { Injectable, NotFoundException, NotAcceptableException, BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as crypto from 'crypto';
import * as randomString from 'randomstring';
import { Constants } from 'src/core/constants/constants';
import { UpdateUserDto } from './updateUserDto';
import { UsersDataService } from './user.data.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersDataService: UsersDataService
  ) {}

  async singup(profilePicture: string, fullName: string, email: string, password: string, phone: string, userType:string) {
      try{
        if(!userType){
          userType = "youth";
        }
        const newUser = await this.usersDataService.singup(profilePicture,
          fullName,
          email,
          password,
          phone,
          userType)
          return newUser;
      }
      catch(err){
          return err
      }
  }

  async encryptPassword(password: string) {
    if(!password){
      throw (new BadRequestException("Missing Password Field"));
    }
    // const algorithm = process.env.ALGORITHM;
    // const secret: any = process.env.SECRET;
    const algorithm = "sha256";
    const secret:any = "random123@text###()00123qweasdzxc";
    const encrypted = crypto.createHash(algorithm, secret).update(password).digest('hex');
    return encrypted;
  }

  async getUserByEmail(email: string) {
      const user = await this.usersDataService.getUserByEmail(email);
      if(!user){
        return null
      }
      return user
  }

  async getUserById(id: string) {
    try{
      const user = await this.usersDataService.getUserById(id);
      return user
    }
    catch(err){
      return err
    }
  }

  async forgetPasswordToken(email:string){
    let user = await this.usersDataService.getUserByEmail(email);
    if(!user){
      throw (new NotFoundException("Invalid email"));
    }
    const token = randomString.generate();
    user.forgetPasswordToken = token;
    user.forgetPasswordTime = Date.now();
    let updatedUser = await this.usersDataService.updateUserObject(user._id,user);
    return updatedUser.forgetPasswordToken;
  }

  async checkForgetPasswordToken(token:string){
    let user = await this.usersDataService.getForgetPasswordToken(token);
    let tokenTime:any = user.forgetPasswordTime;
    let currentTime = Date.now();
    let timeExpiry = (currentTime-tokenTime)/1000/60;
    if(timeExpiry >= 1){
      throw (new NotAcceptableException("Token expired"));
    }
    return user;
  }

  async changePassword(email:string,password:string){
    let user = await this.usersDataService.getUserByEmail(email);
    if(!user){
      throw (new NotFoundException("Invalid Email"));
    }
    user.password = password;
    let updatedUser = await this.usersDataService.updateUserObject(user._id,user);
    return updatedUser;
  }

  async checkOldPassword(email:string,oldPassword:string){
    let user = await this.usersDataService.getUserByEmail(email);
    if(!user){
      throw (new NotFoundException("Invalid Email"));
    }
    if(user.password === oldPassword){
      return true;
    }
    else{
      throw (new BadRequestException("Invalid email or password"));
    }
  }

  async updateUserProfile(userId: string, userUpdated: UpdateUserDto){
    let userUpdate = await this.usersDataService.updateUserObject(userId, userUpdated);
    delete userUpdate.password
    return userUpdate;
  }

  async updateUserRoleToBrandAdvocate(userId: string){
    let userUpdate = await this.usersDataService.getUserById(userId);
    userUpdate.userType = Constants.brandAdvocate;
    let updatedUser = await this.usersDataService.updateUserObject(userId, userUpdate);
    delete updatedUser.password
    return updatedUser;
  }

  async getAllUsersByTypeAndPage(userType:string, page:number, limit:number,){
    let skip = (page - 1) * limit;
    let user = await this.usersDataService.getAllUsersByPage(userType, limit, skip);
    let totalCount = await this.usersDataService.getUsersCountByType(userType);
    if(!user){
      throw (new NotFoundException("No users found"));
    }
    return {
      totalUsers: user,
      totalCount: totalCount
    };
  }

  async incJobAppliedCount(userId: string){
    let userUpdate = await this.usersDataService.incJobAppliedCount(userId);
    userUpdate.password = "";
    return userUpdate;
  }

  async incJobShortlistCount(userId: string){
    let userUpdate = await this.usersDataService.incJobShortlistCount(userId);
    userUpdate.password = "";
    return userUpdate;
  }

  async incManyJobRecommandCount(userId: any){
    let userUpdate = await this.usersDataService.incManyJobRecommandCount(userId);
    return userUpdate;
  }

  async incJobRecommandCount(userId: string){
    let userUpdate = await this.usersDataService.incJobRecommandCount(userId);
    userUpdate.password = "";
    return userUpdate;
  }

  async incJobInterviewCount(userId: string){
    let userUpdate = await this.usersDataService.incJobInterviewCount(userId);
    userUpdate.password = "";
    return userUpdate;
  }

}
