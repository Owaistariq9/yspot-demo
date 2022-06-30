import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  ClientProxy,
  ClientProxyFactory,
  RpcException,
  Transport,
} from "@nestjs/microservices";
import { BookmarksService } from "src/bookmarks/bookmarks.service";
import { FCM_Message } from "src/core/constants/constants";
import { FCMService } from "src/fcm-provider/fcm.service";
import { NotificationsService } from "src/notifications/notification.service";
import { PostsService } from "src/posts/posts.service";
import { SearchService } from "src/search/search.service";
import { UsersService } from "src/users/user.service";
import { InternshipsDataService } from "./internships.data.service";
import { feedbackDto } from "./internships.dto";

@Injectable()
export class InternshipsService {
  // private authService: ClientProxy;
  constructor(
    private readonly internshipsDataService: InternshipsDataService,
    private readonly fcmService: FCMService,
    private readonly notificationService: NotificationsService,
    // private readonly searchService: SearchService,
    private readonly userService: UsersService,
    @Inject(forwardRef(() => PostsService))
    private readonly postService: PostsService,
    @Inject(forwardRef(() => BookmarksService))
    private readonly bookmarkService: BookmarksService
  ) // private readonly postService: PostsService
  {
    // this.authService = ClientProxyFactory.create({
    //     transport: Transport.TCP,
    //     options: {
    //       host: '127.0.0.1',
    //       port: 8878,
    //     },
    // });
  }

  // async getUserDataFromAuthService (userId: string){
  //     let data = this.authService.send<any>('profile',userId);
  //     let updatedData: any;
  //     await data.forEach(y => {
  //         updatedData = y
  //     })
  //     return updatedData;
  // }

  // async internshipArray (arr: any){
  //     let updatedData = [];
  //     // arr.forEach (async val => {
  //         // let data = await this.getUserDataFromAuthService(val._source.data.userId);
  //         // console.log("here",data);
  //         // updatedData.push(data);
  //     // })
  //     for(let i = 0; i<arr.length; i++){
  //         let data = await this.getUserDataFromAuthService(arr[i]._source.data.userId);
  //         console.log("here",data);
  //         updatedData.push(data);
  //     }
  //     console.log("updatedData",updatedData);
  //     return updatedData
  // }

  async insertInternship(obj: any) {
    try {
      const newInternship = await this.internshipsDataService.insertInternships(obj);
      // const esData = await this.searchService.insertInternshipData(newInternship);
      return newInternship;
    } catch (err) {
      return err;
    }
  }

  async insertUserInternship(internshipId: string, userId: string, businessId: string) {
    try {
      const obj = {
        internshipId,
        userId,
        businessId
      }
      const userInternship = await this.internshipsDataService.insertUserInternship(obj);
      return userInternship;
    } catch (err) {
      return err;
    }
  }

  async getInternshipById(id: string) {
    return await this.internshipsDataService.getInternshipById(id);
  }

  async getInternshipByPage(page: number, limit: number, currentUserId: string) {
    let skip = (page - 1) * limit;
    const internships:any = await this.internshipsDataService.getFilteredInternshipsByObj({}, limit, skip, '-createdAt');
    const postIds = [];

    internships.forEach(x => {
      postIds.push(x._id);
      x.isBookmarked = false;
    });

    const check = await this.bookmarkService.checkUserBookmark(currentUserId, postIds);

    internships.forEach(x => {
      check.forEach(y => {
        if(y.postId.toString() === x._id.toString()){
          x.isBookmarked = true;
        }
      });
    });
    return { internships: internships };
  }

  async getUsersInternshipByPage(page: number, limit: number, userId: string) {
    let skip = (page - 1) * limit;
    let internships = await this.internshipsDataService.getAllUsersInternship(
      userId,
      limit,
      skip
    );
    // let internships = await this.searchService.getAllUsersInternshipDataByPage(skip, limit, userId);
    // let updatedData = [];
    // for(let i = 0; i<internships.length; i++){
    //     if(!internships[i]._source.data.userId){
    //         internships[i]._source.data.userId = "618148168fff748826694e73";
    //     }
    //     let data = await this.userService.getUserById(internships[i]._source.data.userId);
    //     internships[i]._source.data.userId = data;
    //     updatedData.push(internships[i]._source.data);
    // }
    return { internships: internships };
  }

  async updateInternship(_id: string, internshipObj: any) {
    const internship = await this.internshipsDataService.updateInternship(
      _id,
      internshipObj
    );
    // const esData = await this.searchService.updateInternshipData(
    //   _id,
    //   internshipObj
    // );
    if (!internship) {
      throw new NotFoundException("There is no internship with this id");
    } else {
      return internship;
    }
  }

  async deleteInternship(internshipId: string) {
    const internship = await this.internshipsDataService.deleteInternship(
      internshipId
    );
    // const esData = await this.searchService.deleteInternshipData(internshipId);
    if (!internship) {
      throw new NotFoundException("There is no internship with this id");
    } else {
      return internship;
    }
  }

  async incCommentCountByPostId(postId: String) {
    const post = await this.internshipsDataService.incCommentCountByInternshipId(postId);
    // const espost = await this.searchService.updateInternshipData(
    //   post._id,
    //   post
    // );
    if (!post) {
      throw new NotFoundException("There is no internship with this Id");
    } else {
      return post;
    }
  }

  async decCommentCountByPostId(postId: String) {
    const internship =
      await this.internshipsDataService.decCommentCountByInternshipId(postId);
    // const espost = await this.searchService.updateInternshipData(
    //   internship._id,
    //   internship
    // );
    if (!internship) {
      throw new NotFoundException("There is no internship with this Id");
    } else {
      return internship;
    }
  }

  async addRecommands(
    recommandList: any,
    userId: string,
    internshipId: string
  ) {
    let recommandDataList =
      await this.internshipsDataService.getExistingRecommandations(
        internshipId,
        recommandList
      );

    let recommondListObj = [];
    let userNotificationListObj = [];
    recommandDataList.forEach(async (x) => {
      // recommondListObj.includes(x.recommandedTo)
      let index = recommandList.indexOf(x.recommandedTo);
      if (index != -1) {
        recommandList.splice(index, 1);
      }
    });
    recommandList.forEach(async (x) => {
      // let internship:any = await this.internshipsDataService.getRecommands(internshipId,userId,x);
      // if(!internship){
      //     let obj= {
      //         internshipId: internshipId,
      //         recommandedBy: userId,
      //         recommandedTo: x
      //     }
      //     const recommand = await this.internshipsDataService.insertRecommands(obj);
      //     internship = await this.internshipsDataService.incRecommandCountByInternshipId(internshipId);
      //     const espost = await this.searchService.updateInternshipData(internship._id, internship);
      // }
      const obj = {
        internshipId: internshipId,
        recommandedBy: userId,
        recommandedTo: x,
      };
      recommondListObj.push(obj);

      const userNotification = {
        userId: x,
        title: FCM_Message.RECOMMANDED().title,
        message: FCM_Message.RECOMMANDED().body
      }
      userNotificationListObj.push(userNotification);
    });

    const users = await this.userService.incManyJobRecommandCount(
      recommandList
    );

    let notification = {
      data: {},
      title: FCM_Message.RECOMMANDED().title,
      body: FCM_Message.RECOMMANDED().body,
    };

    await this.fcmService.pushMessageBulk(recommandList, notification);
    await this.notificationService.insertManyUserNotifications(userNotificationListObj);
    return await this.internshipsDataService.insertManyRecommands(recommondListObj);
  }

  async incResponseCountByPostId(internshipId: String) {
    const internship =
      await this.internshipsDataService.incResponseCountByInternshipId(
        internshipId
      );
    // const esinternship = await this.searchService.updateInternshipData(
    //   internship._id,
    //   internship
    // );
    // const esinternship = await this.searchService.getInternshipData(internship._id);
    // console.log(esinternship);
    // console.log(esinternship.body.hits.hits);
    if (!internship) {
      throw new NotFoundException("There is no internship with this Id");
    } else {
      return internship;
    }
  }

  async getRecommandedInternships(userId: string, page: number, limit: number) {
    let skip = (page - 1) * limit;
    let recommand = await this.internshipsDataService.getUserRecommandations(
      userId,
      limit,
      skip
    );
    let internshipList = [];
    recommand.forEach((x) => {
      internshipList.push(x.internshipId);
    });

    return await this.internshipsDataService.getUserInternshipsByIdList(
      internshipList
    );
  }
    async getFilteredInternships(industry: string, isPaid: boolean, country: string, sort: string, page:number, limit:number, currentUserId: string){
        const skip = (page - 1) * limit;
        let filterObj:any = {};
        let sortBy = "";
        filterObj.isPaid = isPaid;
        if(industry !== "0"){
            filterObj.industry = industry;
        }
        if(country !== "0"){
            filterObj.country = country;
        }
        if(sort === "latest"){
            sortBy = '-createdAt';
        }
        else{
            sortBy = 'createdAt';
        }
        const postIds = [];
        const internships:any = await this.internshipsDataService.getFilteredInternshipsByObj(filterObj, limit, skip, sortBy);

        internships.forEach(x => {
          postIds.push(x._id);
          x.isBookmarked = false;
        });

        const check = await this.bookmarkService.checkUserBookmark(currentUserId, postIds);

        internships.forEach(x => {
          check.forEach(y => {
            if(y.postId.toString() === x._id.toString()){
              x.isBookmarked = true;
            }
          });
        });
        return { internships: internships };
    }

    async updateInternshipInElasticSearch(internshipId:string){
        const internship = await this.internshipsDataService.getInternshipById(internshipId);
        // const esData = await this.searchService.updateInternshipData(internshipId, internship);
        if(!internship){
            throw (new NotFoundException("There is no internship with this id"));
        }
        else{
            return internship;
        }
    }

    async getInternshipDataById(internshipId: string, currentUserId:string) {
      const internship: any = await this.internshipsDataService.getInternshipDataById(internshipId);
      const check = await this.postService.getInternshipResponseByUserIdAndPostId(internshipId, currentUserId);
      if (check) {
        internship.applied = true;
      } else {
        internship.applied = false;
      }
      return internship;
    }

    async updateUserInternshipFeedback(feedBackObj: feedbackDto, userId: string, internshipId: string) {
      feedBackObj.totalRating = Number(feedBackObj.ability) + Number(feedBackObj.contribution) + Number(feedBackObj.creativity) + Number(feedBackObj.adaptability) + Number(feedBackObj.initiative) + Number(feedBackObj.integrity) + Number(feedBackObj.responsiveness);
      feedBackObj.avgRating = Number(feedBackObj.totalRating) / 7;
      const userInternship = await this.internshipsDataService.updateUserInternshipFeedback(internshipId, userId, feedBackObj);
      const user = await this.userService.updateUserInternshipRating(userId, Number(feedBackObj.totalRating));
      return userInternship;
    }

    async getUserInternshipFeedback(userId: string, internshipId: string) {
      return await this.internshipsDataService.getInternshipFeedbackData(internshipId, userId);
    }
}
