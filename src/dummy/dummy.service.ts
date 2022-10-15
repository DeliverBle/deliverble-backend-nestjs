import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { News } from 'src/news/news.entity';
import { NewsRepository } from 'src/news/news.repository';
import { CreateSentenceDefaultDto } from './dto/create-sentence-default.dto';
import { ReturnScriptDefaultDto } from './dto/return-script-default.dto';
import { ReturnSentenceDefaultDto } from './dto/return-sentence-default.dto';
import { UpdateSentenceDefaultDto } from './dto/update-sentence-default.dto';
import { ScriptDefault } from './entity/script-default.entity';
import { SentenceDefault } from './entity/sentence-default.entity';
import { ScriptDefaultRepository } from './repository/script-default.repository';
import { SentenceDefaultRepository } from './repository/sentence-default.repository';

const logger: Logger = new Logger('dummy service');

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

  async createScriptDefault(newsId: number): Promise<ReturnScriptDefaultDto> {
    const news: News = await this.newsRepository.getNewsById(newsId);
    const scriptDefault: ScriptDefault = await this.scriptDefaultRepository.createScriptDefault(news);
    const returnScriptDefaultDto: ReturnScriptDefaultDto = new ReturnScriptDefaultDto(scriptDefault);
    return returnScriptDefaultDto;
  }

  async getScriptDefault(newsId: number): Promise<ReturnScriptDefaultDto> {
    const news: News = await this.newsRepository.getNewsById(newsId);
    const scriptDefaultId: number = (await news.scriptDefault).id;
    const scriptDefault: ScriptDefault = await this.scriptDefaultRepository.findOneOrFail(scriptDefaultId);
    const returnScriptDefaultDto: ReturnScriptDefaultDto = new ReturnScriptDefaultDto(scriptDefault);
    return returnScriptDefaultDto;
  }

  async deleteScriptDefault(newsId: number): Promise<ReturnScriptDefaultDto> {
    const news: News = await this.newsRepository.getNewsById(newsId);
    const scriptDefaultId: number = (await news.scriptDefault).id;
    const scriptDefault: ScriptDefault = await this.scriptDefaultRepository.deleteScriptDefault(scriptDefaultId);
    const returnScriptDefaultDto: ReturnScriptDefaultDto = new ReturnScriptDefaultDto(scriptDefault);
    return returnScriptDefaultDto;
  }

  async createSentenceDefault(createSentenceDefaultDto: CreateSentenceDefaultDto): Promise<ReturnSentenceDefaultDto> {
    const newsId: number = createSentenceDefaultDto.newsId;
    const news: News = await this.newsRepository.getNewsById(newsId);
    const scriptDefault: ScriptDefault = await news.scriptDefault;
    if (!scriptDefault) {
      throw NotFoundError;
    }
    const sentenceDefault: SentenceDefault = await this.sentenceDefaultRepository.createSentenceDefault(scriptDefault, createSentenceDefaultDto); 
    const returnSentenceDefaultDto: ReturnSentenceDefaultDto = new ReturnSentenceDefaultDto(sentenceDefault);
    return returnSentenceDefaultDto;
  }

  async updateSentenceDefault(updateSentenceDefaultDto: UpdateSentenceDefaultDto): Promise<ReturnSentenceDefaultDto> {
    const sentenceDefault: SentenceDefault = await this.sentenceDefaultRepository.updateSentenceDefault(updateSentenceDefaultDto);
    const returnSentenceDefaultDto: ReturnSentenceDefaultDto = new ReturnSentenceDefaultDto(sentenceDefault);
    return returnSentenceDefaultDto;
  }

  async deleteSentenceDefault(sentenceDefaultId: number): Promise<ReturnSentenceDefaultDto> {
    const sentenceDefault: SentenceDefault = await this.sentenceDefaultRepository.deleteSentenceDefault(sentenceDefaultId);
    const returnSentenceDefaultDto: ReturnSentenceDefaultDto = new ReturnSentenceDefaultDto(sentenceDefault);
    return returnSentenceDefaultDto;
  }
}
