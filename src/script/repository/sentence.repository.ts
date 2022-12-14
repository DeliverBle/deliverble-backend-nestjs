import { EntityRepository, Repository } from 'typeorm';
import { CreateSentenceDto } from '../dto/create-sentence.dto';
import { Sentence } from '../entity/sentence.entity';

@EntityRepository(Sentence)
export class SentenceRepository extends Repository<Sentence> {
  async createSentence(
    createSentenceDto: CreateSentenceDto,
  ): Promise<Sentence> {
    const sentence = new Sentence();

    sentence.script = createSentenceDto.script;
    sentence.order = createSentenceDto.order;
    sentence.startTime = createSentenceDto.startTime;
    sentence.endTime = createSentenceDto.endTime;
    sentence.text = createSentenceDto.text;

    await sentence.save();
    return sentence;
  }
}
