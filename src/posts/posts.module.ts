import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    SearchModule,
    UserModule,
    FollowersModule,
    MongooseModule.forFeature([{name:'Post', schema:PostsSchema},]),
    MongooseModule.forFeature([{name:'Responses', schema:ResponseSchema}]),
    MongooseModule.forFeature([{name:'UserResponses', schema:UserResponseSchema, collection:'UserResponses'}])
  ],
  controllers: [PostsController],
  providers: [PostsService,PostsDataService],
  exports: [PostsService,PostsDataService]
})
export class PostsModule {}
