import { NotFoundError } from "rxjs";
import { EntityRepository, Repository } from "typeorm";
import { CreateMemoGuideDto } from "../dto/create-memo-guide.dto";
import { CreateSentenceGuideDto } from "../dto/create-sentence-guide.dto";
import { UpdateSentenceGuideDto } from "../dto/update-sentence-guide.dto";
import { MemoGuide } from "../entity/memo-guide.entity";
import { ScriptGuide } from "../entity/script-guide.entity";
import { SentenceGuide } from "../entity/sentence-guide.entity";

@EntityRepository(MemoGuide)
export class MemoGuideRepository extends Repository<MemoGuide> {
  async createMemoGuide(scriptGuide: ScriptGuide, createMemoGuideDto: CreateMemoGuideDto): Promise<MemoGuide> {
    const memoGuide = new MemoGuide()

    memoGuide.scriptGuide = scriptGuide;
    memoGuide.order = createMemoGuideDto.order;
    memoGuide.startIndex = createMemoGuideDto.startIndex;
    memoGuide.content = createMemoGuideDto.content;

    await this.save(memoGuide);
    return memoGuide;
  }

  // async deleteSentenceGuide(sentenceGuideId: number): Promise<SentenceGuide> {
  //   const sentenceGuide: SentenceGuide = await this.findOneOrFail(sentenceGuideId);
  //   if (!sentenceGuide) {
  //     throw NotFoundError;
  //   }
  //   await this.createQueryBuilder()
  //     .delete()
  //     .from(SentenceGuide)
  //     .where("id = :sentenceGuideId", { sentenceGuideId: sentenceGuideId })
  //     .execute()
  //   return sentenceGuide;
  // }
}
