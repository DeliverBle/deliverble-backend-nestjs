import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from 'src/news/news.entity';
import { NewsRepository } from 'src/news/news.repository';
import { User } from 'src/user/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { Script } from './entity/script.entity';
import { Sentence } from './entity/sentence.entity';
import { ScriptRepository } from './repository/script.repository';
import { SentenceRepository } from './repository/sentence.repository';

@Injectable()
export class ScriptService {
  constructor(
    @InjectRepository(ScriptRepository)
    private scriptRepository: ScriptRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(NewsRepository)
    private newsRepository: NewsRepository,
    @InjectRepository(SentenceRepository)
    private sentenceRepository: SentenceRepository,
  ) {}
    
    async createScript(user: User, newsId: number, scriptName: string): Promise<Script> {
      const news: News = await this.newsRepository.getNewsById(newsId);
      return await this.scriptRepository.createScript(user, news, scriptName);
    };

    async getAllScript(): Promise<Script[]> {
      return await this.scriptRepository.find();
    }

    async deleteScript(scriptId: number): Promise<Script> {
      const scriptDeleted: Script = await this.scriptRepository.deleteScript(scriptId);
      return scriptDeleted;
      
    }

    async createSentence(scriptId: number, order: number, text: string): Promise<Sentence> {
      const script: Script = await this.scriptRepository.findOne(scriptId);
      return await this.sentenceRepository.createSentence(script, order, text)
    }
}
