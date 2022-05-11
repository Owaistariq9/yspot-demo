import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
    constructor(private readonly searchService: ElasticsearchService)
    {}

    async insertPostData (data: any){
        // console.log("data",data);
        let esData = await this.searchService.index({
            index: "posts",
            // type:"posts",
            id: data._id.toString(),
            body: {
                data: data
            }
        })
        return esData;
    }

    async insertInternshipData (data: any){
        // console.log("data",data);
        let esData = await this.searchService.index({
            index: "internships",
            // type:"posts",
            id: data._id.toString(),
            body: {
                data: data
            }
        })
        return esData;
    }

    async getPostData (postId:string){
        let esData: any = await this.searchService.search({
            index: "posts",
            body: {
                query: {
                    match: {
                        _id: postId
                        // "data.privacyFilter.startAge": 0
                    }
                }
            }
        })
        return esData;
    }

    async getInternshipData (postId:string){
        let esData: any = await this.searchService.search({
            index: "internships",
            body: {
                query: {
                    match: {
                        _id: postId
                        // "data.privacyFilter.startAge": 0
                    }
                }
            }
        })
        return esData;
    }

    async deletePostData (postId:string){
        let esData: any = await this.searchService.delete({
            index: "posts",
            id: postId
        })

        return esData;
    }

    async deleteInternshipData (internshipId:string){
        let esData: any = await this.searchService.delete({
            index: "internships",
            id: internshipId
        })
        return esData;
    }

    async updatePostData (postId:string, data: any){
        let esData: any = await this.searchService.update({
            index: "posts",
            id: postId,
            refresh: true,
            body: {
                data: data
            }
        })

        return esData;
    }

    async updateInternshipData (internshipId:string, data: any){
        let esData: any = await this.searchService.update({
            index: "internships",
            id: internshipId,
            refresh: true,
            body: {
                data: data
            }
        })

        return esData;
    }

    async getAllPostData (){
        let esData: any = await this.searchService.search({
            index: "posts",
            body: {
                query: {
                    match_all: {
                        // _id: postId
                    }
                }
            }
        })

        return esData;
    }

    async getAllInternshipDataByPage (skip: number, limit:number){
        let esData: any = await this.searchService.search({
            index: "internships",
            body: {
                query: {
                    match_all: {
                        // _id: postId
                    }
                },
                sort: {
                    "data.createdAt": {
                        order: "desc"
                    }
                }
            },
            from: skip,
            size: limit,
        })

        return esData.body.hits.hits;
    }

    async getAllUsersInternshipDataByPage (skip: number, limit:number, userId:string){
        let esData: any = await this.searchService.search({
            index: "internships",
            body: {
                query: {
                    match_all: {
                        "data.userId": userId
                    }
                },
                sort: {
                    "data.createdAt": {
                        order: "desc"
                    }
                }
            },
            from: skip,
            size: limit,
        })

        return esData.body.hits.hits;
    }

    async test (){
        try{
            let followingsList = ["618148168fff748826694e73"];
            let esData: any = await this.searchService.search({
                index: "posts",
                body: {
                    query: {
                        // term: {
                        //     "data.userId": {
                        //         value: "618148168fff748826694e73"
                        //     }
                        // }
                        // bool: {
                            script: {
                                script: {
                                    lang: 'painless',
                                    // source: `Debug.explain(doc['data'])`,
                                    // source: `if (doc.containsKey('_index')){return true;} else return false;`,
                                    source: `doc['_source'] === doc['_source']`,
                                    // source: `if (doc['_source'] == "posts"){return true;} else return false;`,
                                    // source: `data['userId'].value == '618148168fff748826694e73'`,
                                    params: {
                                        val: followingsList,
                                        // data: `doc['body'].value`
                                        data: {
                                            userId: "618148168fff748826694e73"
                                        }
                                        // userId: "618148168fff748826694e73"
                                    }
                                }
                            }
                        // }
                    }
                }
            })
    
            return esData;
        }
        catch(err){
            return err
        }
    }

    async getNewsFeed (skip: number, limit: number, age: number, country: string, gender: string, userRole: string, userId:string, followingsList: any){
        let esData: any = await this.searchService.search({
            index: "posts",
            body: {
                query: {
                    bool: {
                        must: [
                            {
                                bool: {
                                    should: [
                                        {
                                            bool: {
                                                must: [
                                                    {
                                                        match: {
                                                            "data.privacyFilter.startAge": 0
                                                        }
                                                    },
                                                    {
                                                        match: {
                                                            "data.privacyFilter.endAge": 0
                                                        }
                                                    }
                                                ]    
                                            }
                                        },
                                        {
                                            bool: {
                                                must: [
                                                    {
                                                        range: {
                                                            "data.privacyFilter.startAge": {
                                                                lte: age
                                                            }
                                                        }
                                                    },
                                                    {
                                                        range: {
                                                            "data.privacyFilter.endAge": {
                                                                gte: age
                                                            }
                                                        }
                                                    }
                                                ]    
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                bool: {
                                    should: [
                                        {
                                            bool: {
                                                must_not: {
                                                    exists: {
                                                      field: "data.privacyFilter.countries"
                                                    }
                                                  }
                                            }
                                        },
                                        {
                                            match: {
                                                "data.privacyFilter.countries": country
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                bool: {
                                    should: [
                                        {
                                            match: {
                                                "data.privacyFilter.gender": "both"
                                            }
                                        },
                                        {
                                            match: {
                                                "data.privacyFilter.gender": gender
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                bool: {
                                    should: [
                                        {
                                            match: {
                                                "data.privacyFilter.visibility": "public"
                                            }
                                        },
                                        {
                                            match: {
                                                "data.privacyFilter.visibility": userRole
                                            }
                                        },
                                        {
                                            bool: {
                                                must: [
                                                    {
                                                        match: {
                                                            "data.privacyFilter.visibility": "private"
                                                        }
                                                    },
                                                    {
                                                        match: {
                                                            "data.privacyFilter.users": userId
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            bool: {
                                                must: [
                                                    {
                                                        match: {
                                                            "data.privacyFilter.visibility": "followersOnly"
                                                        }
                                                    },
                                                    {
                                                        "terms" : {
                                                            "data.userId" : followingsList
                                                        }
                                                    }
                                                    // {
                                                    //     script: {
                                                    //         script: {
                                                    //             lang: 'painless',
                                                    //             // source: `params.val.contains(params.data.userId)`,
                                                    //             // source: `if (doc.containsKey('_type')){return true;} else return false;`,
                                                    //             source: `if (doc._type == 'data'){return true;} else return false;`,
                                                    //             // source: `doc['_source'].value == '618148168fff748826694e73'`,
                                                    //             params: {
                                                    //                 val: followingsList,
                                                    //                 // data: `doc['body'].value`
                                                    //                 data: {
                                                    //                     userId: "618148168fff748826694e73"
                                                    //                 }
                                                    //                 // userId: "618148168fff748826694e73"
                                                    //             }
                                                    //         }
                                                    //     }
                                                    // }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                sort: {
                    "data.createdAt": {
                        order: "desc"
                    }
                }
            },
            from: skip,
            size: limit,
            // "sort": "data.createdAt"
        })
        // console.log("elastic",esData.body.hits.hits);
        return esData;
    }
}
