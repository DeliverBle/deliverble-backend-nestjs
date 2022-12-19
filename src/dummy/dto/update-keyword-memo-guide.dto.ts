export class UpdateKeywordMemoGuideDto {
  constructor(memoGuideId: number, keyword: string) {
    this.memoGuideId = memoGuideId;
    this.keyword = keyword;
  }
  memoGuideId: number;
  keyword: string;
}
