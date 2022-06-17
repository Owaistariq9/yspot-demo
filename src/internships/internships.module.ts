import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from 'src/posts/posts.module';
import { SearchModule } from 'src/search/search.module';
import { InternshipsController } from './internships.controller';
import { InternshipsDataService } from './internships.data.service';
import { InternshipsSchema } from './models/internships.model';
import { InternshipsService } from './internships.service';
import { RecommandsSchema } from './models/recommands.model';
import { UserModule } from 'src/users/user.module';
import { FCMProviderModule } from 'src/fcm-provider/fcm.module';
import { BookmarksModule } from 'src/bookmarks/bookmarks.module';
import { UserInternshipsSchema } from './models/userInternships.model';

@Module({
  imports: [MongooseModule.forFeature([{name:'Internships', schema:InternshipsSchema, collection:'internships'}]),
  MongooseModule.forFeature([{name:'Recommands', schema:RecommandsSchema, collection:'recommands'}]),
  MongooseModule.forFeature([{name:'UserInternships', schema:UserInternshipsSchema, collection:'user-internships'}]),
// PostsModule,
forwardRef(() => PostsModule),
// BookmarksModule,
forwardRef(() => BookmarksModule),
UserModule,
SearchModule,
FCMProviderModule
],
  controllers: [InternshipsController],
  providers: [InternshipsService,InternshipsDataService],
  exports: [InternshipsService,InternshipsDataService],
})
export class InternshipsModule {}
