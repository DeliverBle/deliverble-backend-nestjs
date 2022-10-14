import { ScriptDefault } from "../entity/script-default.entity";
import { SentenceDefault } from "../entity/sentence-default.entity";

export class ReturnScriptDefaultDto {
  constructor(scriptDefault: ScriptDefault) {
    this.id = scriptDefault.id;
    this.newsId = scriptDefault.news.id;
    this.name = scriptDefault.name;
    this.sentenceDefaults = scriptDefault.sentenceDefaults;
}   
    id: number;
    newsId: number;
    name: string;
    sentenceDefaults: SentenceDefault[];
}
