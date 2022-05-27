import { forwardRef, Module } from '@nestjs/common';
import { NotificationModule } from 'src/notifications/notification.module';
import { NotificationsController } from './fcm.controller';
import { FCMService } from './fcm.service';

@Module({
  imports: [
    forwardRef(()=>NotificationModule)],
  controllers: [],
  providers: [FCMService],
  exports: [FCMService]
})
export class FCMProviderModule {}
