import { News } from "src/news/news.entity";
import { User } from "src/user/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { Script } from "../entity/script.entity";
import { Sentence } from "../entity/sentence.entity";

@EntityRepository(Sentence)
export class SentenceRepository extends Repository<Sentence> {
  // 여기부터 수정
  async createSentence(script: Script, order: number, text: string): Promise<Sentence> {
    const sentence = new Sentence()

    sentence.script = script;
    sentence.order = order;
    sentence.text = text;
    await sentence.save();
    return sentence;
  }
}
