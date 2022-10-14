import { Sentence } from "../entity/sentence.entity";

export class ReturnSentenceDto {
  constructor(sentence: Sentence) {
    this.id = sentence.id;
    this.order = sentence.order;
    this.text = sentence.text;
}   
    id: number;
    order: number;
    text: string;
}
