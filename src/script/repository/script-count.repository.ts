import { EntityRepository, Repository } from "typeorm";
import { ScriptCount } from "../entity/script-count.entity";

@EntityRepository(ScriptCount)
export class ScriptCountRepository extends Repository<ScriptCount> {
  // async createMemo(createMemoDto: CreateMemoDto): Promise<Memo> {
  //   const memo: Memo = new Memo()
  //   memo.script = createMemoDto.script;
  //   memo.order = createMemoDto.order;
  //   memo.startIndex = createMemoDto.startIndex;
  //   memo.content = createMemoDto.content;
    
  //   await memo.save();
  //   return memo;
  // }
}
