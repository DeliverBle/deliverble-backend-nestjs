import { News } from "src/news/news.entity";
import { EntityRepository, Repository } from "typeorm";
import { DUMMY_SCRIPT_DEFAULT_NAME } from "../common/dummy-script-default-name";
import { DUMMY_SCRIPT_TYPE } from "../common/dummy-script-type.enum";
import { DummyScript } from "../entity/dummy-script.entity";

@EntityRepository(DummyScript)
export class DummyScriptRepository extends Repository<DummyScript> {
  async createDummyScript(news: News, dummyScriptType: DUMMY_SCRIPT_TYPE): Promise<DummyScript> {
    const dummyScript = new DummyScript()

    dummyScript.news = news;
    dummyScript.type = dummyScriptType;
    dummyScript.name = DUMMY_SCRIPT_DEFAULT_NAME;

    await this.save(dummyScript);
    return dummyScript;
  }
}
