import { ReturnSentenceDto } from "./return-sentence.dto";

export class ReturnSentenceDtoCollection {
  constructor(returnSentenceDtoList: ReturnSentenceDto[]) {
    this.returnSentenceDtoCollection = returnSentenceDtoList;
  }

  returnSentenceDtoCollection: ReturnSentenceDto[] | [];
}
