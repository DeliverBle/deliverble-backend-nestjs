import { EntityRepository, Repository } from 'typeorm';
import { CreateMemoDto } from '../dto/create-memo.dto';
import { UpdateMemoDto } from '../dto/update-memo.dto';
import { Memo } from '../entity/memo.entity';

@EntityRepository(Memo)
export class MemoRepository extends Repository<Memo> {
  async createMemo(createMemoDto: CreateMemoDto): Promise<Memo> {
    const memo: Memo = new Memo();
    memo.script = createMemoDto.script;
    memo.order = createMemoDto.order;
    memo.startIndex = createMemoDto.startIndex;
    memo.keyword = createMemoDto.keyword;
    memo.content = createMemoDto.content;
    memo.highlightId = createMemoDto.highlightId;

    await memo.save();
    return memo;
  }

  async deleteMemo(memoId: number): Promise<Memo> {
    const memoDeleted: Memo = await this.findOneOrFail(memoId);
    await this.createQueryBuilder()
      .delete()
      .from(Memo)
      .where('id = :memoId', { memoId })
      .execute();
    return memoDeleted;
  }

  async updateMemo(updateMemoDto: UpdateMemoDto): Promise<Memo> {
    const memoId: number = updateMemoDto.memoId;
    const content: string = updateMemoDto.content;
    const memo: Memo = await this.findOneOrFail(memoId);
    memo.content = content;
    await memo.save();
    return memo;
  }

  async getMemoJoinScript(memoId: number): Promise<Memo> {
    return await this.createQueryBuilder('memo')
      .leftJoinAndSelect('memo.script', 'script')
      .where('memo.id = :memoId', { memoId: memoId })
      .getOneOrFail();
  }
}
