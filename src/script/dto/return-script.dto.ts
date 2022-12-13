import { Memo } from "../entity/memo.entity";
import { Script } from "../entity/script.entity";
import { Sentence } from "../entity/sentence.entity";

export class ReturnScriptDto {
  constructor(script: Script) {
    this.id = script.id;
    this.userId = script.user.id;
    this.newsId = script.news.id;
    this.name = script.name;
    this.sentences = script.sentences;
    this.sortMemos(script);
}   
  id: number;
  userId: number;
  newsId: number;
  name: string;
  sentences: Sentence[];
  memos: Memo[];

  sortMemos(script: Script): void {
    let sortingMemos = script.memos;
    sortingMemos.sort((prev, next) => {
      if (prev.order == next.order) {
        return prev.startIndex - next.startIndex;
      }
      return prev.order - next.order;
    });
    this.memos = sortingMemos;
  }
}
