import { EntityRepository, Repository } from "typeorm";
import { CreateMemoDto } from "../dto/create-memo.dto";
import { Memo } from "../entity/memo.entity";

@EntityRepository(Memo)
export class MemoRepository extends Repository<Memo> {
  async createMemo(createMemoDto: CreateMemoDto): Promise<Memo> {
    const memo: Memo = new Memo()

    memo.script = createMemoDto.script;
    memo.order = createMemoDto.order;
    memo.content = createMemoDto.content;
    
    await memo.save();
    return memo;
  }

  async deleteMemo(memoId: number): Promise<Memo> {
    const memoDeleted: Memo = await this.findOneOrFail(memoId);
    await this.createQueryBuilder()
      .delete()
      .from(Memo)
      .where("id = :memoId", { memoId })
      .execute()
    return memoDeleted;
  }

  async getMemoJoinScript(memoId: number): Promise<Memo> {
    console.log("check");
    return await this.createQueryBuilder('memo')
      .leftJoinAndSelect('memo.script', 'script')
      .where('memo.id = :memoId', { memoId: memoId })
      .getOneOrFail();
  }
}
