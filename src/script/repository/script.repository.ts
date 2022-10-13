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
}
