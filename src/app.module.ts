import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { SearchModule } from './search/search.module';
import { InternshipsModule } from './internships/internships.module';
import * as dotenv from 'dotenv';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { UserModule } from './users/user.module';
import { UsersApprovalRequestModule } from './usersApprovalRequest/usersApprovalRequest.module';
import { FollowersModule } from './followers/followers.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notifications/notification.module';
import { FCMProviderModule } from './fcm-provider/fcm.module';
// dotenv.config();
// mongodb+srv://admin:yspot123@yspot-cluster.xdcqg.mongodb.net/yspot?retryWrites=true&w=majority
@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://admin:yspot123@yspot-development.xdcqg.mongodb.net/yspot?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    AuthModule,
    FCMProviderModule,
    NotificationModule,
    UserModule,
    InternshipsModule,
    PostsModule,
    FollowersModule,
    BookmarksModule,
    CommentsModule,
    LikesModule,
    SearchModule,
    UsersApprovalRequestModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
