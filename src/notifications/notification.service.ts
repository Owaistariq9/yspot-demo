import { Injectable, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { UpdateNotificationDto } from './updateNotificationDto';
import { NotificationsDataService } from './notification.data.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly usersDataService: NotificationsDataService
  ) {}

  async create(obj) {
      try{
    
        const newNotification = await this.usersDataService.create(obj)
          return newNotification;
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

  async getNotificationByEmail(email: string) {
      const user = await this.usersDataService.getNotificationByEmail(email);
      if(!user){
        return null
      }
      return user
  }

  async getNotificationById(id: string) {
    try{
      const user = await this.usersDataService.getNotificationById(id);
      return user
    }
    catch(err){
      return err
    }
  }

  async getUsersTokens(userId: string[]) :Promise<string[]>{
    try{
      const user = await this.usersDataService.getUsersTokens(userId);
      return [...new Set(user)] as string[]
    }
    catch(err){
      return err
    }
  }


  async pushNotificationTokens(userId:string, notificationTokens:{deviceId: string,device: string,}):Promise<boolean>{
    let userUpdate = await this.usersDataService.pushNotificationTokens(userId, notificationTokens);
    return userUpdate;
  }
  
  async updateNotificationProfile(userId: string, userUpdated: UpdateNotificationDto){
    let userUpdate = await this.usersDataService.updateNotificationObject(userId, userUpdated);
    return userUpdate;
  }

 
}
