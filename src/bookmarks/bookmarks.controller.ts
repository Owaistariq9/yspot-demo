import { ConsoleLogger, Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BookmarksService } from './bookmarks.service';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @MessagePattern('toggleBookmark')
  async toggleBookmark(@Payload() data: any) {
    const toggleBookmark = await this.bookmarksService.toggleBookmark(
      data.user._id,
      data.params.postId,
    );
    return toggleBookmark;
  }

  @MessagePattern('getAllUserBookmarksWithPagination')
  async getAllUserBookmarksWithPagination(@Payload() data: any) {
    const toggleBookmark =
      await this.bookmarksService.getAllUserBookmarksWithPagination(
        data.user._id,
        data.params.skip,
        data.params.limit,
      );
    return toggleBookmark;
  }
}