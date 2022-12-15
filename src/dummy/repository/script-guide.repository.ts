import { News } from 'src/news/news.entity';
import { EntityRepository, Repository } from 'typeorm';
import { DUMMY_SCRIPT_GUIDE_NAME } from '../common/dummy-script-default-name';
import { ScriptGuide } from '../entity/script-guide.entity';

@EntityRepository(ScriptGuide)
export class ScriptGuideRepository extends Repository<ScriptGuide> {
  async createScriptGuide(news: News): Promise<ScriptGuide> {
    const scriptGuide = new ScriptGuide();

    scriptGuide.news = news;
    scriptGuide.name = DUMMY_SCRIPT_GUIDE_NAME;

    await this.save(scriptGuide);
    return scriptGuide;
  }

  async deleteScriptGuide(scriptGuideId: number): Promise<ScriptGuide> {
    const scriptGuide: ScriptGuide = await this.findOneOrFail(scriptGuideId);
    await this.createQueryBuilder()
      .delete()
      .from(ScriptGuide)
      .where('id = :scriptGuideId', { scriptGuideId: scriptGuideId })
      .execute();
    return scriptGuide;
  }

  async getScriptGuideByNewsId(newsId: number): Promise<ScriptGuide> {
    const scriptGuide: ScriptGuide = await this.createQueryBuilder(
      'scriptGuide',
    )
      .leftJoinAndSelect('scriptGuide.news', 'news')
      .leftJoinAndSelect('scriptGuide.sentenceGuides', 'sentenceGuides')
      .where('news.id = :newsId', { newsId: newsId })
      .getOne();
    return scriptGuide;
  }
}
