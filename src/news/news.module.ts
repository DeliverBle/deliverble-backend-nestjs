import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsController } from './news.controller';
import { NewsRepository } from './news.repository';
import { NewsService } from './news.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NewsRepository]),
  ],
  controllers: [NewsController],
  providers: [NewsService]
})
export class NewsModule {}
