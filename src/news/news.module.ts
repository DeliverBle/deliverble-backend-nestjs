import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TagRepository } from 'src/tag/tag.repository';
import { NewsController } from './news.controller';
import { NewsRepository } from './news.repository';
import { NewsService } from './news.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NewsRepository, TagRepository]),
    AuthModule,
  ],
  controllers: [NewsController],
  providers: [NewsService]
})
export class NewsModule {}
