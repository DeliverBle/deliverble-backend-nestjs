import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from 'src/news/news.entity';
import { NewsRepository } from 'src/news/news.repository';
import { User } from 'src/user/user.entity';
import { HistoryRepository } from './history.repository';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(HistoryRepository)
    private historyRepository: HistoryRepository,
    @InjectRepository(NewsRepository)
    private newsRepository: NewsRepository,
  ) {};

  async createHistory(user: User, newsId: number): Promise<void> {
    const news: News = await this.newsRepository.getNewsById(newsId);
    await this.historyRepository.createHistory(user, news);
  }
}
