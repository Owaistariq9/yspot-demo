import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './user.controller';
import { UsersDataService } from './user.data.service';
import { UserSchema } from './user.model';
import { UsersService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([{name:'User', schema:UserSchema}])],
  controllers: [UsersController],
  providers: [UsersService, UsersDataService],
  exports: [UsersService, UsersDataService]
})
export class UserModule {}
