import { NotificationsService } from "../notifications/notification.service";
import * as _ from "lodash";
import { Injectable } from "@nestjs/common";
import * as firebaseAdmin from 'firebase-admin';
import { MulticastMessage } from "firebase-admin/lib/messaging/messaging-api";

@Injectable()
export class FCMService {
  readonly _CLASS_NAME = "NotificationService";


  constructor(private readonly dataService: NotificationsService
    ) {


  }
  // {
  //   data:{},
  //   title:"",
  //   body:""
  // }

 async pushMessageBulk(userIds:string[],notificationDTO) {
    // These registration tokens come from the client FCM SDKs.
    let fcmTokens:string[] = await this.dataService.getUsersTokens(userIds)
     const message :MulticastMessage= {
      data: notificationDTO.data,
      notification:{title:notificationDTO.title,body:notificationDTO.body},
      tokens: fcmTokens
    };
     const failedTokens = [];
     try{

  
      firebaseAdmin
      .messaging()
      .sendMulticast(message)
         .then((response) => {
          console.log('messages were sent successfully');
       
       }).catch((err)=>{
        console.log("err",err,"err")
      })
    }catch(err){
      console.log('try',err,'try err')
    }
  }

  // sends notification to request.UserId or request.Topics
  async sendNotification(
    request: any
  ): Promise<any> {
   console.log("**********SEND NOTIFICATION START**************")
    let recipients: string[] = [];

    if (request.UserId) {
      // Request has User Id
      // Notifications will be sent to user devices, if any
      var user = await this.dataService.getNotificationById(request.UserId);

      if (user && user.notificationTokens && user.notificationTokens.length > 0) {
        recipients = user.notificationTokens.map((x) => x.deviceId);
        let result = await firebaseAdmin
        .messaging()
        .sendToDevice(recipients, request.Notification);
      }
      console.log(`Send User Count ${recipients.length}`)
   console.log("********** NOTIFICATION SEND COMPLETED**************")

      return true;

  }
}
}