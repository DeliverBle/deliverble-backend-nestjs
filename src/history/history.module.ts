import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsRepository } from 'src/news/news.repository';
import { HistoryController } from './history.controller';
import { HistoryRepository } from './history.repository';
import { HistoryService } from './history.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HistoryRepository, NewsRepository,
    ]),
  ],
  controllers: [HistoryController],
  providers: [HistoryService]
})
export class HistoryModule {}
