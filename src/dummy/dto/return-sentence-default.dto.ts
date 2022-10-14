import { SentenceDefault } from "../entity/sentence-default.entity";

export class ReturnSentenceDefaultDto {
  constructor(sentenceDefault: SentenceDefault) {
    this.id = sentenceDefault.id;
    this.order = sentenceDefault.order;
    this.text = sentenceDefault.text;
}   
    id: number;
    order: number;
    text: string;
}
