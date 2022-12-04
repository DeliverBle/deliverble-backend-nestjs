
import { MemoGuide } from "../entity/memo-guide.entity";
import { ScriptGuide } from "../entity/script-guide.entity";
import { SentenceGuide } from "../entity/sentence-guide.entity";

export class ReturnScriptGuideDto {
  constructor(scriptGuide: ScriptGuide) {
    this.id = scriptGuide.id;
    this.newsId = scriptGuide.news.id;
    this.name = scriptGuide.name;
    this.sentences = scriptGuide.sentenceGuides;
    this.saveSortedMemoGuides(scriptGuide);
}   
    id: number;
    newsId: number;
    name: string;
    sentences: SentenceGuide[];
    memoGuides: MemoGuide[];

    saveSortedMemoGuides(scriptGuide: ScriptGuide): void {
      let sortingMemos = scriptGuide.memoGuides;
      sortingMemos.sort((prev, next) => {
        if (prev.order == next.order) {
          return prev.startIndex - next.startIndex;
        }
        return prev.order - next.order;
      });
      this.memoGuides = sortingMemos;
    }
}
