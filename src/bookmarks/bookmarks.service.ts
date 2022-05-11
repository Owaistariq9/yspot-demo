import { Injectable, NotFoundException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { PostsService } from '../posts/posts.service';
import { RpcException } from '@nestjs/microservices';
import { BookmarksDataService } from './bookmarks.data.service';

@Injectable()
export class BookmarksService {
  constructor(
    private readonly postsService: PostsService,
    private readonly bookmarkDataService: BookmarksDataService,
  ) {}

  async toggleBookmark(userId, postId) {
    try {
      const post = await this.postsService.getPostById(postId);

      if (!post) {
        throw new RpcException(new NotFoundException('Invalid PostId'));
      }

      const userBookmark = await this.bookmarkDataService.isUserBookmarkExist(
        userId,
        postId,
      );

      if (userBookmark) {
        await this.bookmarkDataService.deleteBookMark(userId, postId);

        return 'bookmark deleted ';
      } else {
        const bookmark = await this.bookmarkDataService.createBookMark(
          userId,
          postId,
        );

        return { bookmark, message: 'bookmark added' };
      }
    } catch (err) {
      return err;
    }
  }

  async getAllUserBookmarksWithPagination(
    userId: string,
    skip: number,
    limit: number,
  ) {
    try {

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
