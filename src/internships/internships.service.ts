import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, RpcException, Transport } from '@nestjs/microservices';
import { PostsService } from 'src/posts/posts.service';
import { SearchService } from 'src/search/search.service';
import { UsersService } from 'src/users/user.service';
import { InternshipsDataService } from './internships.data.service';

@Injectable()
export class InternshipsService {
    // private authService: ClientProxy;
    constructor(private readonly internshipsDataService: InternshipsDataService,
        private readonly searchService: SearchService,
        private readonly userService: UsersService,
        private readonly postService: PostsService)
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

    async insertInternship (obj:any){
        try{
            const newInternship = await this.internshipsDataService.insertInternships(obj);
            const esData = await this.searchService.insertInternshipData(newInternship);
            return newInternship;
        }
        catch(err){
            return err
        }
    }

    async getInternshipById (id:string){
        return await this.internshipsDataService.getInternshipById(id);
    }

    async getInternshipByPage(page:number,limit:number){
        let skip = (page - 1) * limit;
        let internships = await this.searchService.getAllInternshipDataByPage(skip, limit);
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
        for(let i = 0; i<internships.length; i++){
            if(!internships[i]._source.data.userId){
                internships[i]._source.data.userId = "618148168fff748826694e73";
            }
            let data = await this.userService.getUserById(internships[i]._source.data.userId);
            internships[i]._source.data.userId = data;
            updatedData.push(internships[i]._source.data);
        }
        return {"internships": updatedData};
    }

    async getUsersInternshipByPage(page:number,limit:number, userId:string){
        let skip = (page - 1) * limit;
        let internships = await this.internshipsDataService.getAllUsersInternship(userId, limit, skip);
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
        return {"internships": internships};
    }

    async updateInternship(_id:string, internshipObj: any){
        const internship = await this.internshipsDataService.updateInternship(_id,internshipObj);
        const esData = await this.searchService.updateInternshipData(_id, internshipObj);
        if(!internship){
            throw (new NotFoundException("There is no internship with this id"));
        }
        else{
            return internship;
        }
    }

    async deleteInternship(internshipId:string){
        const internship = await this.internshipsDataService.deleteInternship(internshipId);
        const esData = await this.searchService.deleteInternshipData(internshipId);
        if(!internship){
            throw (new NotFoundException("There is no internship with this id"));
        }
        else{
            return internship;
        }
    }

    async incCommentCountByPostId(postId:String){
        const post = await this.internshipsDataService.incCommentCountByInternshipId(postId);
        const espost = await this.searchService.updateInternshipData(post._id, post);
        if(!post){
            throw (new NotFoundException("There is no internship with this Id"));
        }
        else{
            return post;
        }
    }

    async decCommentCountByPostId(postId:String){
        const internship = await this.internshipsDataService.decCommentCountByInternshipId(postId);
        const espost = await this.searchService.updateInternshipData(internship._id, internship);
        if(!internship){
            throw (new NotFoundException("There is no internship with this Id"));
        }
        else{
            return internship;
        }
    }

    async addRecommands(recommandList: any, userId: string, internshipId: string){
        recommandList.forEach(async x => {
            let internship:any = await this.internshipsDataService.getRecommands(internshipId,userId,x);
            if(!internship){
                let obj= {
                    internshipId: internshipId,
                    recommandedBy: userId,
                    recommandedTo: x
                }
                const recommand = await this.internshipsDataService.insertRecommands(obj);
                internship = await this.internshipsDataService.incRecommandCountByInternshipId(internshipId);
                const espost = await this.searchService.updateInternshipData(internship._id, internship);
            }
        });
    }

    // async addResponse(responseObj: any, userId: string){
    //     return await this.postService.addInternshipResponse(responseObj, userId);
    // }

}
