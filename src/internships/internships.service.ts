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
import { FCM_Message } from "src/core/constants/constants";
import { FCMService } from "src/fcm-provider/fcm.service";
import { PostsService } from "src/posts/posts.service";
import { SearchService } from "src/search/search.service";
import { UsersService } from "src/users/user.service";
import { InternshipsDataService } from "./internships.data.service";

@Injectable()
export class InternshipsService {
  // private authService: ClientProxy;
  constructor(
    private readonly internshipsDataService: InternshipsDataService,
    private readonly fcmService: FCMService,
    private readonly searchService: SearchService,
    private readonly userService: UsersService,
    @Inject(forwardRef(() => PostsService))
    private readonly postService: PostsService
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
      const newInternship = await this.internshipsDataService.insertInternships(
        obj
      );
      const esData = await this.searchService.insertInternshipData(
        newInternship
      );
      return newInternship;
    } catch (err) {
      return err;
    }
  }

  async getInternshipById(id: string) {
    return await this.internshipsDataService.getInternshipById(id);
  }

  async getInternshipByPage(
    page: number,
    limit: number,
    currentUserId: string
  ) {
    let skip = (page - 1) * limit;
    let internships = await this.searchService.getAllInternshipDataByPage(
      skip,
      limit
    );
    let updatedData = [];
    // await internships.forEach( async val => {
    //     console.log(val._source);
    //     let data = this.authService.send<any>('profile',val._source.data.userId);
    //     await data.forEach(y => {
    //         val._source.data.userId = y;
    //         updatedData.push(y);
    //         console.log("user data", val._source.data.userId)
    //     })
    // });
    // let data = this.authService.send<any>('profile',internships[0]._source.data.userId);
    //     await data.forEach(y => {
    //         internships[0]._source.data.userId = y;
    //         updatedData.push(y);
    //         console.log("user data", internships[0]._source.data.userId)
    //     })
    // let data = await this.getUserDataFromAuthService(internships[0]._source.data.userId);
    // await internships.forEach (async val => {
    //     let data = await this.getUserDataFromAuthService(val._source.data.userId);
    //     console.log("here",data);
    //     updatedData.push(data);
    // })
    // console.log(internships);
    // console.log("updatedData",updatedData);
    // let newData = await this.internshipArray(internships);
    for (let i = 0; i < internships.length; i++) {
      if (!internships[i]._source.data.userId) {
        internships[i]._source.data.userId = "618148168fff748826694e73";
      }
      let data = await this.userService.getUserById(
        internships[i]._source.data.userId
      );
      internships[i]._source.data.userId = data;
      let check = await this.postService.getInternshipResponseByUserIdAndPostId(
        internships[i]._id,
        currentUserId
      );
      if (check) {
        internships[i]._source.data.applied = true;
      } else {
        internships[i]._source.data.applied = false;
      }
      updatedData.push(internships[i]._source.data);
    }
    return { internships: updatedData };
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
    const esData = await this.searchService.updateInternshipData(
      _id,
      internshipObj
    );
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
    const esData = await this.searchService.deleteInternshipData(internshipId);
    if (!internship) {
      throw new NotFoundException("There is no internship with this id");
    } else {
      return internship;
    }
  }

  async incCommentCountByPostId(postId: String) {
    const post =
      await this.internshipsDataService.incCommentCountByInternshipId(postId);
    const espost = await this.searchService.updateInternshipData(
      post._id,
      post
    );
    if (!post) {
      throw new NotFoundException("There is no internship with this Id");
    } else {
      return post;
    }
  }

  async decCommentCountByPostId(postId: String) {
    const internship =
      await this.internshipsDataService.decCommentCountByInternshipId(postId);
    const espost = await this.searchService.updateInternshipData(
      internship._id,
      internship
    );
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
      let obj = {
        internshipId: internshipId,
        recommandedBy: userId,
        recommandedTo: x,
      };
      recommondListObj.push(obj);
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

    return await this.internshipsDataService.insertManyRecommands(
      recommondListObj
    );
  }

  async incResponseCountByPostId(internshipId: String) {
    const internship =
      await this.internshipsDataService.incResponseCountByInternshipId(
        internshipId
      );
    const esinternship = await this.searchService.updateInternshipData(
      internship._id,
      internship
    );
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

  // async addResponse(responseObj: any, userId: string){
  //     return await this.postService.addInternshipResponse(responseObj, userId);
  // }
}
