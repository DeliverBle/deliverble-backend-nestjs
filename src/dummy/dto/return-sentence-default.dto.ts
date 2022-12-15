import { SentenceDefault } from '../entity/sentence-default.entity';

export class ReturnSentenceDefaultDto {
  constructor(sentenceDefault: SentenceDefault) {
    this.id = sentenceDefault.id;
    this.order = sentenceDefault.order;
    this.startTime = sentenceDefault.startTime;
    this.endTime = sentenceDefault.endTime;
    this.text = sentenceDefault.text;
  }
  id: number;
  order: number;
  startTime: number;
  endTime: number;
  text: string;
}
