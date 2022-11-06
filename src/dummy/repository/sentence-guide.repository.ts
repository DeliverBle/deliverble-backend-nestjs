import { NotFoundError } from "rxjs";
import { EntityRepository, Repository } from "typeorm";
import { CreateSentenceGuideDto } from "../dto/create-sentence-guide.dto";
import { UpdateSentenceGuideDto } from "../dto/update-sentence-guide.dto";
import { ScriptGuide } from "../entity/script-guide.entity";
import { SentenceGuide } from "../entity/sentence-guide.entity";

@EntityRepository(SentenceGuide)
export class SentenceGuideRepository extends Repository<SentenceGuide> {
  async createSentenceGuide(scriptGuide: ScriptGuide, createSentenceGuideDto: CreateSentenceGuideDto): Promise<SentenceGuide> {
    const sentenceGuide = new SentenceGuide()

    sentenceGuide.scriptGuide = scriptGuide;
    sentenceGuide.order = createSentenceGuideDto.order;
    sentenceGuide.startTime = createSentenceGuideDto.startTime;
    sentenceGuide.endTime = createSentenceGuideDto.endTime;
    sentenceGuide.text = createSentenceGuideDto.text;

    await this.save(sentenceGuide);
    return sentenceGuide;
  }

  async updateSentenceGuide(updateSentenceGuideDto: UpdateSentenceGuideDto): Promise<SentenceGuide> {
    const sentenceGuideId: number = updateSentenceGuideDto.sentenceGuideId;
    await this.createQueryBuilder()
      .update()
      .set({
        order: updateSentenceGuideDto.order,
        startTime: updateSentenceGuideDto.startTime,
        endTime: updateSentenceGuideDto.endTime,
        text: updateSentenceGuideDto.text,
      })
      .where("id = :sentenceGuideId", { sentenceGuideId: sentenceGuideId })
      .execute()
    const sentenceGuide: SentenceGuide = await this.findOneOrFail(sentenceGuideId);
    if (!sentenceGuide) {
      throw NotFoundError;
    }
    return sentenceGuide;
  }

  async deleteSentenceGuide(sentenceGuideId: number): Promise<SentenceGuide> {
    const sentenceGuide: SentenceGuide = await this.findOneOrFail(sentenceGuideId);
    if (!sentenceGuide) {
      throw NotFoundError;
    }
    await this.createQueryBuilder()
      .delete()
      .from(SentenceGuide)
      .where("id = :sentenceGuideId", { sentenceGuideId: sentenceGuideId })
      .execute()
    return sentenceGuide;
  }
}
