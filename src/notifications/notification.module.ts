import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FCMProviderModule } from 'src/fcm-provider/fcm.module';
import { NotificationSchema } from './models/notification.model';
import { UserNotificationSchema } from './models/userNotifications.model';
// import { FCMProviderModule } from 'src/fcm-provider/fcm.module';
import { NotificationsController } from './notification.controller';
import { NotificationsDataService } from './notification.data.service';
import { NotificationsService } from './notification.service';

@Module({
  imports: [forwardRef(()=>FCMProviderModule),
  MongooseModule.forFeature([{name:'Notification', schema:NotificationSchema}]),
  MongooseModule.forFeature([{name:'UserNotification', schema:UserNotificationSchema, collection:'user-notifications'}])],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsDataService],
  exports: [NotificationsService, NotificationsDataService]
})
export class NotificationModule {}
