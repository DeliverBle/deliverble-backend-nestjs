import { News } from "src/news/news.entity";
import { User } from "src/user/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { History } from "./history.entity";

@EntityRepository(History)
export class HistoryRepository extends Repository<History> {

  async createHistory(user: User, news: News): Promise<History> {
    const history: History = new History(user, news);

    await this.save(history);
    return history;
  }

  async getHistory(user: User, news: News): Promise<History> {
    const userId: number = user.id;
    const newsId: number = news.id;
    const history: History = await this.createQueryBuilder('history')
      .leftJoinAndSelect('history.user', 'user')
      .leftJoinAndSelect('history.news', 'news')
      .where('user.id = :userId', { userId: userId })
      .andWhere('news.id = :newsId', { newsId: newsId })
      .getOne();
    return history;
  }

  async getHistoryById(historyId: number): Promise<History> {
    return await this.findOne(historyId);
  }
}
