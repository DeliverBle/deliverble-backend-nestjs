import { User } from 'src/user/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { ScriptCount } from '../entity/script-count.entity';

@EntityRepository(ScriptCount)
export class ScriptCountRepository extends Repository<ScriptCount> {
  async createScriptCount(user: User, newsId: number): Promise<ScriptCount> {
    const scriptCount: ScriptCount = new ScriptCount();

    scriptCount.user = user;
    scriptCount.newsId = newsId;
    scriptCount.count = 1;

    scriptCount.save();
    return scriptCount;
  }

  async getScriptCount(userId: number, newsId: number): Promise<ScriptCount> {
    return await this.createQueryBuilder('scriptCount')
      .leftJoinAndSelect('scriptCount.user', 'user')
      .where('user.id = :userId', { userId: userId })
      .andWhere('newsId = :newsId', { newsId: newsId })
      .getOne();
  }
}
