import { ReturnNewsDto } from "./return-news.dto";

export class ReturnNewsDtoCollection {
  constructor(returnNewsDtoList: ReturnNewsDto[]) {
    this.returnNewsDtoCollection = returnNewsDtoList;
  }

  returnNewsDtoCollection: ReturnNewsDto[] | [];
}
