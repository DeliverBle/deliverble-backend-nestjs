import { NotFoundError } from "rxjs";
import { News } from "src/news/news.entity";
import { EntityRepository, Repository } from "typeorm";
import { DUMMY_SCRIPT_DEFAULT_NAME } from "../common/dummy-script-default-name";
import { ScriptDefault } from "../entity/script-default.entity";

@EntityRepository(ScriptDefault)
export class ScriptDefaultRepository extends Repository<ScriptDefault> {
  async createScriptDefault(news: News): Promise<ScriptDefault> {
    const scriptDefault = new ScriptDefault()

    scriptDefault.news = news;
    scriptDefault.name = DUMMY_SCRIPT_DEFAULT_NAME;

    await this.save(scriptDefault);
    return scriptDefault;
  }

  async deleteScriptDefault(scriptDefaultId: number): Promise<ScriptDefault> {
    const scriptDefault: ScriptDefault = await this.findOneOrFail(scriptDefaultId);
    if (!scriptDefault) {
      throw NotFoundError;
    }
    await this.createQueryBuilder()
      .delete()
      .from(ScriptDefault)
      .where("id = :scriptDefaultId", { scriptDefaultId })
      .execute()
    return scriptDefault;
  }
}
