import { forwardRef, Module } from '@nestjs/common';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { PostsModule } from '../posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BookMarksSchema } from './bookmark.model';
import { BookmarksDataService } from './bookmarks.data.service';
import { InternshipsModule } from 'src/internships/internships.module';

@Module({
  imports: [
    // PostsModule,
    // InternshipsModule,
    forwardRef(() => PostsModule),
    forwardRef(() => InternshipsModule),
    MongooseModule.forFeature([{ name: 'Bookmarks', schema: BookMarksSchema }]),
  ],
  controllers: [BookmarksController],
  providers: [BookmarksService, BookmarksDataService],
  exports: [BookmarksService, BookmarksDataService]
})
export class BookmarksModule {}
