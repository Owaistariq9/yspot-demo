import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts.controller';
import { PostsDataService } from './posts.data.service';
import { PostsSchema } from './models/posts.model';
import { PostsService } from './posts.service';
import { ResponseSchema } from './models/post.response.model';
import { UserResponseSchema } from './models/post.userResponse.model';
import { SearchModule } from 'src/search/search.module';
import { UserModule } from 'src/users/user.module';
import { FollowersModule } from 'src/followers/followers.module';
import { InternshipsModule } from 'src/internships/internships.module';
import { FCMProviderModule } from 'src/fcm-provider/fcm.module';
import { LikesModule } from 'src/likes/likes.module';
// import { LikesService } from 'src/likes/likes.service';
// import { LikesDataService } from 'src/likes/likes.data.service';
// import { LikeSchema } from 'src/likes/likes.model';

@Module({
  imports: [
    FCMProviderModule,
    SearchModule,
    UserModule,
    FollowersModule,
    forwardRef(() => InternshipsModule),
    forwardRef(() => LikesModule),
    // InternshipsModule,
    MongooseModule.forFeature([{name:'Post', schema:PostsSchema},]),
    MongooseModule.forFeature([{name:'Responses', schema:ResponseSchema}]),
    MongooseModule.forFeature([{name:'UserResponses', schema:UserResponseSchema, collection:'UserResponses'}]),
    // MongooseModule.forFeature([{name:'Likes', schema:LikeSchema}])
  ],
  controllers: [PostsController],
  providers: [PostsService,PostsDataService],
  exports: [PostsService,PostsDataService]
})
export class PostsModule {}
