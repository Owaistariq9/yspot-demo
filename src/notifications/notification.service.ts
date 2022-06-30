import { Injectable, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { UpdateNotificationDto } from './updateNotificationDto';
import { NotificationsDataService } from './notification.data.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsDataService: NotificationsDataService
  ) {}

  async create(obj) {
      try{
    
        const newNotification = await this.notificationsDataService.create(obj)
          return newNotification;
      }
      catch(err){
          return err
      }
  }

  async insertManyUserNotifications (arr: any){
    const newNotification = await this.notificationsDataService.insertManyUserNotifications(arr);
    return newNotification;
}

  async addUserNotification(obj: any) {
    const newNotification = await this.notificationsDataService.addUserNotification(obj);
    return newNotification;
  }

  async getUserNotificationByPage(userId: string, page:number, limit:number) {
    const skip = (page - 1) * limit;
    const newNotification = await this.notificationsDataService.getUserNotificationByPage(userId, skip, limit);
    return newNotification;
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
      const user = await this.notificationsDataService.getNotificationByEmail(email);
      if(!user){
        return null
      }
      return user
  }

  async getNotificationById(id: string) {
    try{
      const user = await this.notificationsDataService.getNotificationById(id);
      return user
    }
    catch(err){
      return err
    }
  }

  async getUsersTokens(userId: string[]) :Promise<string[]>{
    try{
      const user = await this.notificationsDataService.getUsersTokens(userId);
      return [...new Set(user)] as string[]
    }
    catch(err){
      return err
    }
  }


  async pushNotificationTokens(userId:string, notificationTokens:{deviceId: string,device: string,}):Promise<boolean>{
    let userUpdate = await this.notificationsDataService.pushNotificationTokens(userId, notificationTokens);
    return userUpdate;
  }
  
  async updateNotificationProfile(userId: string, userUpdated: UpdateNotificationDto){
    let userUpdate = await this.notificationsDataService.updateNotificationObject(userId, userUpdated);
    return userUpdate;
  }

 
}
