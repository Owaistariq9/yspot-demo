import { Module } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { FollowersController } from './followers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowersSchema } from './followers.model';
import { FollowersDataService } from './followers.data.service';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [ MongooseModule.forFeature([{name:'followers', schema:FollowersSchema}]),
UserModule ],
  controllers: [FollowersController],
  providers: [FollowersService, FollowersDataService],
  exports: [FollowersService, FollowersDataService]
})
export class FollowersModule {}
