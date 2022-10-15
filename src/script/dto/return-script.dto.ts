import { Script } from "../entity/script.entity";
import { Sentence } from "../entity/sentence.entity";

export class ReturnScriptDto {
  constructor(script: Script) {
    this.id = script.id;
    this.userId = script.user.id;
    this.newsId = script.news.id;
    this.name = script.name;
    this.sentences = script.sentences;
}   
  id: number;
  userId: number;
  newsId: number;
  name: string;
  sentences: Sentence[];
}
