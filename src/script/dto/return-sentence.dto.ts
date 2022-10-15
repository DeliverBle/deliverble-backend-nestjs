import { Sentence } from "../entity/sentence.entity";

export class ReturnSentenceDto {
  constructor(sentence: Sentence) {
    this.id = sentence.id;
    this.order = sentence.order;
    this.startTime = sentence.startTime;
    this.endTime = sentence.endTime;
    this.text = sentence.text;
}   
    id: number;
    order: number;
    startTime: number;
    endTime: number;
    text: string;
}
