import {
  Controller,
  Post,
  Request,
  Param,
  UseGuards,
  HttpException,
  Get,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { FCMService } from "src/fcm-provider/fcm.service";
import { NotificationsService } from "./notification.service";

@Controller("notification")
export class NotificationsController {
  constructor(
    private readonly fcmService: FCMService,
    private readonly notificationService: NotificationsService) {}

  
  @Get("/test")
  async send(){
    let pushnotification: any = {
      Notification:{
      data:{},
      notification: {
        title: "TITLE",
        body: "BODY",
      }},
      UserId: "62879f5467d6621689cd0493",
    };
    let resp = await this.fcmService.sendNotification(pushnotification)
      // {}
      // ["dj9PlHldREuN-miucs7-MX:APA91bH7mZxIOF_zEZQQ2D9aPdvOMYCxvhgzrQebZiXdZlw_bjR0aI1uzDPxu4WVTwQzqyoM8QDFaYk2D2tQb7kiQuUUMiG7XcXKVDV98dJP5QsOEJuNFdfMBB697AFAfRz9EH3rp4vB"],
      // { 
      //   notification:{"title":"",body:""}
      // },false
      // )
      return resp
  }

  @UseGuards(JwtAuthGuard)
  @Get("user/:page/:limit")
  async getUserNotificationsByPage(@Request() req: any) {
    return await this.notificationService.getUserNotificationByPage(req.user._id, req.params.page, req.params.limit);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/token")
  async addNotificationToken(@Request() req: any) {
    try {
      const getNotification = await this.notificationService.getNotificationById(
        req.user._id
      );
      let updateNotification;
      if (getNotification) {
        updateNotification = await this.notificationService.pushNotificationTokens(
          req.user._id,
          {
            deviceId: req.body.deviceId,
            device: req.body.type,
          }
        );
      } else {
        let obj: any = {
          userId: req.user._id,
          notificationTokens: [
            { deviceId: req.body.deviceId, type: req.body.type },
          ],
        };
        updateNotification = await this.notificationService.create(obj);
      }
      if (updateNotification) {
        return {message:"Successfull Token Added"};
      }else{
        return {message:"Fail Token Added"};
      }
    } catch (err) {
      console.log("errerr", err, "errerr");
      throw new HttpException(err.response, err.status);
    }
  }
}
