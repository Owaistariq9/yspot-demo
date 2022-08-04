import { Module, forwardRef } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { PostsModule } from 'src/posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeSchema } from './likes.model';
import { LikesDataService } from './likes.data.service';

@Module({
  imports: [forwardRef(() => PostsModule),
  MongooseModule.forFeature([{name:'Likes', schema:LikeSchema}])],
  providers: [LikesService,LikesDataService],
  controllers: [LikesController],
  exports: [LikesService,LikesDataService]
})
export class LikesModule {}
