import { NotFoundError } from "rxjs";
import { EntityRepository, Repository } from "typeorm";
import { CreateSentenceDefaultDto } from "../dto/create-sentence-default.dto";
import { ScriptDefault } from "../entity/script-default.entity";
import { SentenceDefault } from "../entity/sentence-default.entity";

@EntityRepository(SentenceDefault)
export class SentenceDefaultRepository extends Repository<SentenceDefault> {
  async createSentenceDefault(scriptDefault: ScriptDefault, createSentenceDefaultDto: CreateSentenceDefaultDto): Promise<SentenceDefault> {
    const sentenceDefault = new SentenceDefault()

    sentenceDefault.scriptDefault = scriptDefault;
    sentenceDefault.order = createSentenceDefaultDto.order;
    sentenceDefault.startTime = createSentenceDefaultDto.startTime;
    sentenceDefault.endTime = createSentenceDefaultDto.endTime;
    sentenceDefault.text = createSentenceDefaultDto.text;

    await this.save(sentenceDefault);
    return sentenceDefault;
  }

  async updateSentenceDefault(sentenceDefaultId: number, order: number, text: string): Promise<SentenceDefault> {
    await this.createQueryBuilder()
      .update()
      .set({
        order: order,
        text: text,
      })
      .where("id = :sentenceDefaultId", { sentenceDefaultId })
      .execute()
    const sentenceDefault: SentenceDefault = await this.findOneOrFail(sentenceDefaultId);
    if (!sentenceDefault) {
      throw NotFoundError;
    }
    return sentenceDefault;
  }

  async deleteSentenceDefault(sentenceDefaultId: number): Promise<SentenceDefault> {
    const sentenceDefault: SentenceDefault = await this.findOneOrFail(sentenceDefaultId);
    if (!sentenceDefault) {
      throw NotFoundError;
    }
    await this.createQueryBuilder()
      .delete()
      .from(SentenceDefault)
      .where("id = :sentenceDefaultId", { sentenceDefaultId })
      .execute()
    return sentenceDefault;
  }
}
