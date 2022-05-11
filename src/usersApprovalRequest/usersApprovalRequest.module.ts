import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersApprovalRequestController } from './usersApprovalRequest.controller';
import { UsersApprovalRequestDataService } from './usersApprovalRequest.data.service';
import { UsersApprovalRequestSchema } from './usersApprovalRequest.model';
import { UsersApprovalRequestService } from './usersApprovalRequest.service';

@Module({
  imports: [MongooseModule.forFeature([{name:'UsersApprovalRequest', schema:UsersApprovalRequestSchema, collection:'UsersApprovalRequest'}])],
  controllers: [UsersApprovalRequestController],
  providers: [UsersApprovalRequestService, UsersApprovalRequestDataService],
  exports: [UsersApprovalRequestService, UsersApprovalRequestDataService]
})
export class UsersApprovalRequestModule {}
