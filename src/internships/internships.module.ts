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

@Module({
  imports: [MongooseModule.forFeature([{name:'Internships', schema:InternshipsSchema, collection:'internships'}]),
  MongooseModule.forFeature([{name:'Recommands', schema:RecommandsSchema, collection:'recommands'}]),
// PostsModule,
forwardRef(() => PostsModule),
UserModule,
SearchModule],
  controllers: [InternshipsController],
  providers: [InternshipsService,InternshipsDataService],
  exports: [InternshipsService,InternshipsDataService],
})
export class InternshipsModule {}
