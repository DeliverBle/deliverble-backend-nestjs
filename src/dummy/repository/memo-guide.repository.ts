import { NotFoundError } from 'rxjs';
import { EntityRepository, Repository } from 'typeorm';
import { CreateMemoGuideDto } from '../dto/create-memo-guide.dto';
import { CreateSentenceGuideDto } from '../dto/create-sentence-guide.dto';
import { UpdateKeywordMemoGuideDto } from '../dto/update-keyword-memo-guide.dto';
import { UpdateMemoGuideDto } from '../dto/update-memo-guide.dto';
import { UpdateSentenceGuideDto } from '../dto/update-sentence-guide.dto';
import { MemoGuide } from '../entity/memo-guide.entity';
import { ScriptGuide } from '../entity/script-guide.entity';
import { SentenceGuide } from '../entity/sentence-guide.entity';

@EntityRepository(MemoGuide)
export class MemoGuideRepository extends Repository<MemoGuide> {
  async createMemoGuide(
    scriptGuide: ScriptGuide,
    createMemoGuideDto: CreateMemoGuideDto,
  ): Promise<MemoGuide> {
    const memoGuide = new MemoGuide();

    memoGuide.scriptGuide = scriptGuide;
    memoGuide.order = createMemoGuideDto.order;
    memoGuide.startIndex = createMemoGuideDto.startIndex;
    memoGuide.content = createMemoGuideDto.content;

    await this.save(memoGuide);
    return memoGuide;
  }

  async deleteMemoGuide(memoGuideId: number): Promise<MemoGuide> {
    const memoGuide: MemoGuide = await this.findOneOrFail(memoGuideId);
    if (!memoGuide) {
      throw NotFoundError;
    }
    await this.createQueryBuilder()
      .delete()
      .from(MemoGuide)
      .where('id = :memoGuideId', { memoGuideId: memoGuideId })
      .execute();
    return memoGuide;
  }

  async updateKeywordOfMemoGuide(updateKeywordMemoGuideDto: UpdateKeywordMemoGuideDto): Promise<MemoGuide> {
    const memoGuideId: number = updateKeywordMemoGuideDto.memoGuideId;
    const keyword: string = updateKeywordMemoGuideDto.keyword;
    const memoGuide: MemoGuide = await this.findOneOrFail(memoGuideId);
    if (!memoGuide) {
      throw NotFoundError;
    }
    memoGuide.keyword = keyword;
    await this.save(memoGuide);
    return memoGuide;
  }

  async updateMemoGuide(updateMemoGuideDto: UpdateMemoGuideDto): Promise<MemoGuide> {
    const memoGuideId: number = updateMemoGuideDto.memoGuideId;
    const memoGuide: MemoGuide = await this.findOneOrFail(memoGuideId);
    if (!memoGuide) {
      throw NotFoundError;
    }
    memoGuide.order = updateMemoGuideDto.order;
    memoGuide.startIndex = updateMemoGuideDto.startIndex;
    memoGuide.keyword = updateMemoGuideDto.keyword;
    memoGuide.content = updateMemoGuideDto.content;
    await this.save(memoGuide);
    return memoGuide;
  }
}
