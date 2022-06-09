import { Injectable, NotFoundException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { PostsService } from '../posts/posts.service';
import { RpcException } from '@nestjs/microservices';
import { BookmarksDataService } from './bookmarks.data.service';
import { InternshipsService } from 'src/internships/internships.service';
import { Constants } from 'src/core/constants/constants';

@Injectable()
export class BookmarksService {
  constructor(
    private readonly postsService: PostsService,
    private readonly internshipsService: InternshipsService,
    private readonly bookmarkDataService: BookmarksDataService,
  ) {}

  async toggleBookmark(userId:string, postId:string, postType:string) {
    try {
      let post;
      if(postType === Constants.internship){
        post = await this.internshipsService.getInternshipById(postId);
      }
      else{
        post = await this.postsService.getPostById(postId);
      }

      if (!post) {
        throw (new NotFoundException('Invalid PostId'));
      }

      const userBookmark = await this.bookmarkDataService.isUserBookmarkExist(
        userId,
        postId,
      );

      if (userBookmark) {
        await this.bookmarkDataService.deleteBookMark(userId, postId);

        return { message: 'bookmark removed' };
      } else {
        const bookmark = await this.bookmarkDataService.createBookMark(
          userId,
          postId,
          postType
        );

        return { bookmark, message: 'bookmark added' };
      }
    } catch (err) {
      return err;
    }
  }

  async getAllUserBookmarksWithPagination(
    userId: string,
    page: number,
    limit: number,
  ) {
    try {
      let skip = (page - 1) * limit;
      const userBookmarksWithPagination =
        await this.bookmarkDataService.getAllUserBookmarksWithPagination(
          userId,
          skip,
          limit,
        );

      return userBookmarksWithPagination;

    } catch (err) {
      return err;
    }
  }
}
