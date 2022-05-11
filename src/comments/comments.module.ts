import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InternshipsModule } from 'src/internships/internships.module';
import { PostsModule } from 'src/posts/posts.module';
import { CommentsController } from './comments.controller';
import { CommentsDataService } from './comments.data.service';
import { CommentSchema } from './comments.model';
import { CommentsService } from './comments.service';

@Module({
  imports: [PostsModule,InternshipsModule,MongooseModule.forFeature([{name:'Comments', schema:CommentSchema}])],
  providers: [CommentsService,CommentsDataService],
  exports:[CommentsService,CommentsDataService],
  controllers: [CommentsController],
})
export class CommentsModule {}
