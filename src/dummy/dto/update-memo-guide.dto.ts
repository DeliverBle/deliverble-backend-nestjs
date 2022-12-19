export class UpdateMemoGuideDto {
  constructor(
    memoGuideId: number,
    order: number,
    startIndex: number,
    keyword: string,
    content: string
    ) {
    this.memoGuideId = memoGuideId;
    this.order = order;
    this.startIndex = startIndex;
    this.keyword = keyword;
    this.content = content;
  }
  memoGuideId: number;
  order: number;
  startIndex: number;
  keyword: string;
  content: string;
}
