import { BadRequestException, Controller, Get, Param, Post } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { UsersApprovalRequestService } from './usersApprovalRequest.service';

@Controller('usersApprovalRequest')
export class UsersApprovalRequestController {
    constructor(private readonly usersApprovalRequest: UsersApprovalRequestService) {}

    @MessagePattern('getAllRequests')
    // @Get()
    async getAllRequests(){
      return this.usersApprovalRequest.getAllUserRequest();
    }

    @MessagePattern('getRequestByUserId')
    // @Get('/:id')
    async getRequestByUserId(
        @Payload() userId:string,
        // @Param() id:string
        ){
      return this.usersApprovalRequest.getUserRequestByUserId(userId);
    }

    @MessagePattern('approveUserByUserId')
    // @Post('approveUser/:id')
    async approveUserByUserId(
        @Payload() userId:string,
        // @Param('id') id
        ){
        const approvedUser = await this.usersApprovalRequest.approveUserRequestByUserId(userId);
        if(!approvedUser){
            throw new RpcException(new BadRequestException('Invalid UserId'));
        }
        return "User Approved"
    }

}
