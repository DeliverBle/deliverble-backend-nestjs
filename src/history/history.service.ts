import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from 'src/news/news.entity';
import { NewsRepository } from 'src/news/news.repository';
import { User } from 'src/user/user.entity';
import { History } from './history.entity';
import { HistoryRepository } from './history.repository';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(HistoryRepository)
    private historyRepository: HistoryRepository,
    @InjectRepository(NewsRepository)
    private newsRepository: NewsRepository,
  ) {};

  async fetchHistory(user: User, newsId: number): Promise<void> {
    const news: News = await this.newsRepository.getNewsById(newsId);
    let history: History = await this.historyRepository.getHistory(user, news);
    console.log(history);
    if (!history) {
      await this.historyRepository.createHistory(user, news);
    }
  }
}
