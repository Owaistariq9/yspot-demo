import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BookmarksService } from './bookmarks.service';

@Controller()
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  // @MessagePattern('toggleBookmark')
  @UseGuards(JwtAuthGuard)
  @Post("posts/:postId/:postType/bookmark")
  async toggleBookmark(@Request() req: any) {
    const toggleBookmark = await this.bookmarksService.toggleBookmark(
      req.user._id,
      req.params.postId,
      req.params.postType,
    );
    return toggleBookmark;
  }

  // @MessagePattern('getAllUserBookmarksWithPagination')
  @UseGuards(JwtAuthGuard)
  @Get("bookmark/:page/:limit")
  async getAllUserBookmarksWithPagination(@Request() req: any) {
    const toggleBookmark =
      await this.bookmarksService.getAllUserBookmarksWithPagination(
        req.user._id,
        req.params.page,
        req.params.limit,
      );
    return {"bookmark": toggleBookmark};
  }
}