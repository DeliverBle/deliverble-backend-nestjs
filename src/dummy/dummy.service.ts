import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { News } from 'src/news/news.entity';
import { NewsRepository } from 'src/news/news.repository';
import { ScriptDefault } from './entity/script-default.entity';
import { SentenceDefault } from './entity/sentence-default.entity';
import { ScriptDefaultRepository } from './repository/script-default.repository';
import { SentenceDefaultRepository } from './repository/sentence-default.repository';

@Injectable()
export class DummyService {
  constructor(
    @InjectRepository(NewsRepository)
    private newsRepository: NewsRepository,
    @InjectRepository(ScriptDefaultRepository)
    private scriptDefaultRepository: ScriptDefaultRepository,
    @InjectRepository(SentenceDefaultRepository)
    private sentenceDefaultRepository: SentenceDefaultRepository,
  ) {}

  async createScriptDefault(newsId: number): Promise<ScriptDefault> {
    const news: News = await this.newsRepository.getNewsById(newsId);
    return await this.scriptDefaultRepository.createScriptDefault(news);
  }

  async getScriptDefault(newsId: number): Promise<ScriptDefault> {
    const news: News = await this.newsRepository.getNewsById(newsId);
    const scriptDefaultId: number = (await news.scriptDefault).id;
    const scriptDefault: ScriptDefault = await this.scriptDefaultRepository.findOneOrFail(scriptDefaultId);
    return scriptDefault;
  }

  async deleteScriptDefault(newsId: number): Promise<ScriptDefault> {
    const news: News = await this.newsRepository.getNewsById(newsId);
    const scriptDefaultId: number = (await news.scriptDefault).id;
    return this.scriptDefaultRepository.deleteScriptDefault(scriptDefaultId);
  }

  async createSentenceDefault(newsId: number, order: number, text: string): Promise<SentenceDefault> {
    const news: News = await this.newsRepository.getNewsById(newsId);
    const scriptDefault: ScriptDefault = await news.scriptDefault;
    if (!scriptDefault) {
      throw NotFoundError;
    }
    return await this.sentenceDefaultRepository.createSentenceDefault(scriptDefault, order, text); 
  }

  async updateSentenceDefault(sentenceDefaultId: number, order: number, text: string): Promise<SentenceDefault> {
    return await this.sentenceDefaultRepository.updateSentenceDefault(sentenceDefaultId, order, text);
  }

  async deleteSentenceDefault(sentenceDefaultId: number): Promise<SentenceDefault> {
    return await this.sentenceDefaultRepository.deleteSentenceDefault(sentenceDefaultId);
  }
}
