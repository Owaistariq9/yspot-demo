import {
    Controller,
    Post,
    Body,
    Request,
    Get,
    Param,
    Patch,
    Delete,
    BadRequestException,
    UseGuards,
    InternalServerErrorException,
    NotFoundException,
    HttpException,
    Put
  } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './updateUserDto';
import { userDTO } from './user.dto';
import { UsersService } from './user.service';
  
  @Controller("users")
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // @MessagePattern("reset-password")
    @Post("reset-password")
    async resetPassword(@Body('email') email:string){
      try{
        const token = await this.usersService.forgetPasswordToken(email);
        if(!token){
          throw (new NotFoundException('Invalid Email'));
        }
        return{
          url:'http://localhost:3000/yspot/api/v1/users/reset-password/'+token
        }
      }
      catch(err){
        return err;
      }
    }

    // @MessagePattern("checkResetPassword")
    @Get("reset-password/:token")
    async checkResetPassword(@Param('token') token: string){
      try{
        const user = await this.usersService.checkForgetPasswordToken(token);
        return {"email":user.email};
      }
      catch(err){
        throw (new HttpException(err.response,err.status));
      }
    }

    // @MessagePattern("changePassword")
    @Post("reset-password/:token")
    async changePassword(@Param('token') token: string,
    @Request() req:any){
      try{
        const user = await this.usersService.checkForgetPasswordToken(token);
        let encryptedPassword = await this.usersService.encryptPassword(req.body.password);
        const newUser = await this.usersService.changePassword(req.body.email,encryptedPassword);
        if(newUser){
          return "Password Updated"
        }
      }
      catch(err){
        throw (new HttpException(err.response,err.status));
      }
    }

    @UseGuards(JwtAuthGuard)
    @Post("update-password")
    // @MessagePattern("updatePassword")
    async updatePassword(@Request() req:any){
      try{
        const user:userDTO = await this.usersService.getUserById(req.user._id);
        let oldEncryptedPassword = await this.usersService.encryptPassword(req.body.oldPassword);
        let newEncryptedPassword = await this.usersService.encryptPassword(req.body.newPassword);
        let check = await this.usersService.checkOldPassword(user.email,oldEncryptedPassword);
        if(check == true){
          let newUser = await this.usersService.changePassword(user.email,newEncryptedPassword);
          return "Password Updated";
        }
      }
      catch(err){
        throw (new HttpException(err.response,err.status));
      }
    }

    // @MessagePattern("updateUserProfile")
    @UseGuards(JwtAuthGuard)
    @Put("")
    async updateUserProfile(@Request() req:any,
    @Body() userUpdateProfile:UpdateUserDto) {
      try{
        return await this.usersService.updateUserProfile(req.user._id,userUpdateProfile);
      }
      catch(err){
        throw (new InternalServerErrorException(err.message));
      }
    }

    @UseGuards(JwtAuthGuard)
    @Patch('brandAdvocate')
    // @MessagePattern("updateUserRoleToBrandAdvocate")
    async updateUserRoleToBrandAdvocate(@Request() req:any) {
      try{
        return await this.usersService.updateUserRoleToBrandAdvocate(req.user._id);
      }
      catch(err){
        throw (new InternalServerErrorException(err.message));
      }
    }
  
    // @UseGuards(JwtAuthGuard)
    // @Get("profile")
    // async getUserData(@Request() req:any,
    // @Payload() userId:String) {
    //   try{
    //     let id = req.user._id || userId ;
    //     const user:userDTO = await this.usersService.getUserById(id);
    //     user.password = null;
    //     return user;
    //   }
    //   catch(err){
    //     throw new InternalServerErrorException(err.message);
    //   }
    // }
    
    
    // @MessagePattern("profile")
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getUserProfile(
    @Request() req:any) {
      try{
        // if(req.user._id == "626a61d2c17e668e207e07ba" || req.user._id == "626921dfde0ca337bdec1542"){
        //   req.user._id = "618148168fff748826694e73";
        // }
        const user:userDTO = await this.usersService.getUserById(req.user._id);
        if(user){
          user.password = null;
        }
        return user;
      }
      catch(err){
        throw (new InternalServerErrorException(err.message));
      }
    }

    @Get(':userType/:page/:limit')
    // @MessagePattern("profile")
    async getAllUsersByTypeAndPage(
    @Request() req:any) {
      if(req.params.userType === "business" || req.params.userType === "youth"){
        return await this.usersService.getAllUsersByTypeAndPage(req.params.userType,req.params.page,req.params.limit);
      }
      else{
        throw (new BadRequestException("Invalid userType"));
      }
    }

  }