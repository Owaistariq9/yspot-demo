import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './search.service';
import * as dotenv from 'dotenv'
// dotenv.config();


@Module({
imports: [
    // ElasticsearchModule.register({
    // node: 'https://yspot.es.us-central1.gcp.cloud.es.io:9243',
    // maxRetries: 5,
    // requestTimeout: 60000,
    // auth: {
    //     username:"elastic",
    //     password: "132jZLucd0DKZ0x0zaroFSX7"
    // }
    // })
    ElasticsearchModule.registerAsync({
        useFactory: () => ({
            // node: process.env.ES_NODE,
            // maxRetries: 5,
            // requestTimeout: 60000,
            // auth: {
            //     username: process.env.ES_USERNAME,
            //     password: process.env.ES_PASSWORD
            // }
            // node: "https://cef00210780d4c389f7670c63e429c99.southeastasia.azure.elastic-cloud.com:9243",
            node: "https://1cf4135099ce4a8a8c0e3b939bc8ec1d.us-central1.gcp.cloud.es.io",
            maxRetries: 5,
            requestTimeout: 60000,
            auth: {
                username: "elastic",
                password: "AWJTlaq03r1SW91TCDF58j7m"
            }
        })
      })
],
  providers: [SearchService],
  exports: [SearchService]
})
export class SearchModule {}
