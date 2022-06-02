import { Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bookmarks } from './bookmark.model';

@Injectable()
export class BookmarksDataService {
  constructor(
    @InjectModel('Bookmarks') private readonly bookmarkModel: Model<Bookmarks>,
  ) {}

  async isUserBookmarkExist(userId: string, postId: string) {
    try {
      const userBookmarkExist = await this.bookmarkModel.exists({
        userId,
        postId,
      });

      return userBookmarkExist;
    } catch (err) {
      return err;
    }
  }

  async createBookMark(userId: string, postId: string, postType: string) {
    try {
      const userBookmarkExist = new this.bookmarkModel({
        userId,
        postId,
        postType
      });

      await userBookmarkExist.save();
      return userBookmarkExist;
    } catch (err) {
      return err;
    }
  }

  async deleteBookMark(userId: string, postId: string) {
    try {
      const userBookmarkExist = await this.bookmarkModel.deleteOne({
        userId,
        postId,
      });

      return userBookmarkExist;
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
      const userBookmarksWithPagination = await this.bookmarkModel
        .find({"userId":userId})
        .populate({path:'postId',model:"Internships"})
        .limit(limit)
        .skip(skip)
        .sort('-createdAt')
        .lean()
        .exec();

      return userBookmarksWithPagination;
    } catch (err) {
      return err;
    }
  }
}
