import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FCMProviderModule } from 'src/fcm-provider/fcm.module';
// import { FCMProviderModule } from 'src/fcm-provider/fcm.module';
import { NotificationsController } from './notification.controller';
import { NotificationsDataService } from './notification.data.service';
import { NotificationSchema } from './notification.model';
import { NotificationsService } from './notification.service';

@Module({
  imports: [forwardRef(()=>FCMProviderModule),MongooseModule.forFeature([{name:'Notification', schema:NotificationSchema}])],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsDataService],
  exports: [NotificationsService, NotificationsDataService]
})
export class NotificationModule {}
