import { News } from "src/news/news.entity";
import { User } from "src/user/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { Script } from "../entity/script.entity";

@EntityRepository(Script)
export class ScriptRepository extends Repository<Script> {
  async createScript(user: User, news: News, scriptName: string): Promise<Script> {
    const script = new Script()

    script.name = scriptName;
    script.user = user;
    script.news = news;

    await this.save(script);
    return script;
  }

  async deleteScript(scriptId: number): Promise<Script> {
    const script: Script = await this.findOneOrFail(scriptId);
    await this.createQueryBuilder()
      .delete()
      .from(Script)
      .where("id = :scriptId", { scriptId })
      .execute()
    return script
  }

  async getScriptById(scriptId: number): Promise<Script> {
    const script: Script = await this.createQueryBuilder('script')
      .leftJoinAndSelect('script.user', 'user')
      .leftJoinAndSelect('script.news', 'news')
      .leftJoinAndSelect('script.sentences', 'sentences')
      .where('script.id = :scriptId', { scriptId: scriptId })
      .getOneOrFail();
    return script;
  }

  async getScriptsOfUserAndNews(userId: number, newsId: number): Promise<Script[]> {
    const scripts: Script[] = await this.createQueryBuilder('script')
      .leftJoinAndSelect('script.user', 'user')
      .leftJoinAndSelect('script.news', 'news')
      .leftJoinAndSelect('script.sentences', 'sentences')
      .where('user.id = :userId', { userId: userId })
      .andWhere('news.id = :newsId', { newsId: newsId })
      .getMany();
    return scripts;
  }

}
