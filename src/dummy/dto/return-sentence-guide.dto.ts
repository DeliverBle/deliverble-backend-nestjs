import { SentenceGuide } from '../entity/sentence-guide.entity';

export class ReturnSentenceGuideDto {
  constructor(sentenceGuide: SentenceGuide) {
    this.id = sentenceGuide.id;
    this.order = sentenceGuide.order;
    this.startTime = sentenceGuide.startTime;
    this.endTime = sentenceGuide.endTime;
    this.text = sentenceGuide.text;
  }
  id: number;
  order: number;
  startTime: number;
  endTime: number;
  text: string;
}
