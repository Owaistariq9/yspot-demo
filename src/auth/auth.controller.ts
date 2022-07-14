import { BadRequestException, Body, Controller, Headers, Post, Request, UnauthorizedException, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Constants } from 'src/core/constants/constants';
// import { ExceptionFilter } from 'src/rpc-exception.filter';
import { userDTO } from 'src/users/user.dto';
import { UsersService } from 'src/users/user.service';
import { UsersApprovalRequestService } from 'src/usersApprovalRequest/usersApprovalRequest.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly usersService: UsersService,
        private readonly authService: AuthService,
        private readonly usersApprovalRequestService: UsersApprovalRequestService
        ) {}

     @Post('/login')
    //  @UseFilters(new ExceptionFilter())
    //  @MessagePattern("login")
     async login(@Headers() header:any) {
         if(!header.authorization){
             throw new UnauthorizedException("User credentials invalid");
         }
         let authList = header.authorization.split(" ");
        // throw {
        //     error: "error",
        //     status:"400"
        // });
        // throw new BadRequestException("error"));
        // let authList = token.split(" ");
         if(authList[0]!== Constants.basic){
            throw new UnauthorizedException("User credentials invalid");
         }
         let data = authList[1]
         let buff = Buffer.from(data, 'base64');
         let text = buff.toString('ascii');
         let userList = text.split(":");
         let userEmail = userList[0];
         let userPassword = userList[1];
         let user = await this.authService.validateUser(userEmail,userPassword);
         if(!user){
            throw new UnauthorizedException("User credentials invalid");
         }
        //  else if(user.status !== Constants.approved){
        //     throw new UnauthorizedException("This account is not approved by admin yet"));
        //  }
         return this.authService.login(user);
     }

     @Post('/signup')
    // @MessagePattern("signup")
     async singup(
       @Body() user:userDTO
     ) {
         const checkUser = await this.usersService.getUserByEmail(user.email);
         if(checkUser){
            throw (new BadRequestException("User already exists."));
         }
         else{
             const encryptedPassword = await this.usersService.encryptPassword(user.password);
             const userData = await this.usersService.singup(
             user.profilePicture,
             user.fullName,
             user.email,
             encryptedPassword,
             user.phone,
             user.gender,
             user.userType
           );
           let reqObj = {
               userId: userData._id,
               status: Constants.pending,
               email: userData.email,
               fullName: userData.fullName,
               profilePicture: userData.profilePicture,
               userType: userData.userType
           }
           const userRequest = await this.usersApprovalRequestService.insertUserRequest(reqObj);
           return { _id: userData._id };
         }
     }
}
