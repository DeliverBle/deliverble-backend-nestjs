import { MemoGuide } from '../entity/memo-guide.entity';

export class ReturnMemoGuideDto {
  constructor(memoGuide: MemoGuide) {
    this.id = memoGuide.id;
    this.order = memoGuide.order;
    this.startIndex = memoGuide.startIndex;
    this.keyword = memoGuide.keyword;
    this.content = memoGuide.content;
  }
  id: number;
  order: number;
  startIndex: number;
  keyword: string;
  content: string;
}
