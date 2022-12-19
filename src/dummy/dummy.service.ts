import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { News } from 'src/news/news.entity';
import { NewsRepository } from 'src/news/news.repository';
import { CreateMemoGuideDto } from './dto/create-memo-guide.dto';
import { CreateSentenceDefaultDto } from './dto/create-sentence-default.dto';
import { CreateSentenceGuideDto } from './dto/create-sentence-guide.dto';
import { ReturnMemoGuideDto } from './dto/return-memo-guide.dto';
import { ReturnScriptDefaultDto } from './dto/return-script-default.dto';
import { ReturnScriptGuideDto } from './dto/return-script-guide.dto';
import { ReturnSentenceDefaultDto } from './dto/return-sentence-default.dto';
import { ReturnSentenceGuideDto } from './dto/return-sentence-guide.dto';
import { UpdateKeywordMemoGuideDto } from './dto/update-keyword-memo-guide.dto';
import { UpdateMemoGuideDto } from './dto/update-memo-guide.dto';
import { UpdateSentenceDefaultDto } from './dto/update-sentence-default.dto';
import { UpdateSentenceGuideDto } from './dto/update-sentence-guide.dto';
import { MemoGuide } from './entity/memo-guide.entity';
import { ScriptDefault } from './entity/script-default.entity';
import { ScriptGuide } from './entity/script-guide.entity';
import { SentenceDefault } from './entity/sentence-default.entity';
import { SentenceGuide } from './entity/sentence-guide.entity';
import { MemoGuideRepository } from './repository/memo-guide.repository';
import { ScriptDefaultRepository } from './repository/script-default.repository';
import { ScriptGuideRepository } from './repository/script-guide.repository';
import { SentenceDefaultRepository } from './repository/sentence-default.repository';
import { SentenceGuideRepository } from './repository/sentence-guide.repository';

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
    @InjectRepository(ScriptGuideRepository)
    private scriptGuideRepository: ScriptGuideRepository,
    @InjectRepository(SentenceGuideRepository)
    private sentenceGuideRepository: SentenceGuideRepository,
    @InjectRepository(MemoGuideRepository)
    private memoGuideRepository: MemoGuideRepository,
  ) {}

  async createScriptDefault(newsId: number): Promise<ReturnScriptDefaultDto> {
    const news: News = await this.newsRepository.getNewsById(newsId);
    const scriptDefault: ScriptDefault =
      await this.scriptDefaultRepository.createScriptDefault(news);
    const returnScriptDefaultDto: ReturnScriptDefaultDto =
      new ReturnScriptDefaultDto(scriptDefault);
    return returnScriptDefaultDto;
  }

  async createScriptGuide(newsId: number): Promise<ReturnScriptGuideDto> {
    const news: News = await this.newsRepository.getNewsById(newsId);
    const scriptGuide: ScriptGuide =
      await this.scriptGuideRepository.createScriptGuide(news);
    const returnScriptDefaultDto: ReturnScriptGuideDto =
      new ReturnScriptGuideDto(scriptGuide);
    return returnScriptDefaultDto;
  }

  async getScriptDefault(newsId: number): Promise<ReturnScriptDefaultDto> {
    const news: News = await this.newsRepository.getNewsById(newsId);
    const scriptDefaultId: number = (await news.scriptDefault).id;
    const scriptDefault: ScriptDefault =
      await this.scriptDefaultRepository.findOneOrFail(scriptDefaultId);
    const returnScriptDefaultDto: ReturnScriptDefaultDto =
      new ReturnScriptDefaultDto(scriptDefault);
    return returnScriptDefaultDto;
  }

  async getScriptGuide(newsId: number): Promise<ReturnScriptGuideDto> {
    const news: News = await this.newsRepository.getNewsById(newsId);
    const scriptGuideId: number = (await news.scriptGuide).id;
    const scriptGuide: ScriptGuide =
      await this.scriptGuideRepository.findOneOrFail(scriptGuideId);
    const returnScriptGuideDto: ReturnScriptGuideDto = new ReturnScriptGuideDto(
      scriptGuide,
    );
    return returnScriptGuideDto;
  }

  async deleteScriptDefault(newsId: number): Promise<ReturnScriptDefaultDto> {
    const news: News = await this.newsRepository.getNewsById(newsId);
    const scriptDefaultId: number = (await news.scriptGuide).id;
    const scriptDefault: ScriptDefault =
      await this.scriptDefaultRepository.deleteScriptDefault(scriptDefaultId);
    const returnScriptDefaultDto: ReturnScriptDefaultDto =
      new ReturnScriptDefaultDto(scriptDefault);
    return returnScriptDefaultDto;
  }

  async deleteScriptGuide(newsId: number): Promise<ReturnScriptGuideDto> {
    const news: News = await this.newsRepository.getNewsById(newsId);
    const scriptGuideId: number = (await news.scriptGuide).id;
    const scriptGuide: ScriptGuide =
      await this.scriptGuideRepository.deleteScriptGuide(scriptGuideId);
    const returnScriptGuideDto: ReturnScriptGuideDto = new ReturnScriptGuideDto(
      scriptGuide,
    );
    return returnScriptGuideDto;
  }

  async createSentenceDefault(
    createSentenceDefaultDto: CreateSentenceDefaultDto,
  ): Promise<ReturnSentenceDefaultDto> {
    const newsId: number = createSentenceDefaultDto.newsId;
    const news: News = await this.newsRepository.getNewsById(newsId);
    const scriptDefault: ScriptDefault = await news.scriptDefault;
    if (!scriptDefault) {
      throw NotFoundError;
    }
    const sentenceDefault: SentenceDefault =
      await this.sentenceDefaultRepository.createSentenceDefault(
        scriptDefault,
        createSentenceDefaultDto,
      );
    const returnSentenceDefaultDto: ReturnSentenceDefaultDto =
      new ReturnSentenceDefaultDto(sentenceDefault);
    return returnSentenceDefaultDto;
  }

  async createSentenceGuide(
    createSentenceGuideDto: CreateSentenceGuideDto,
  ): Promise<ReturnSentenceGuideDto> {
    const newsId: number = createSentenceGuideDto.newsId;
    const news: News = await this.newsRepository.getNewsById(newsId);
    const scriptGuide: ScriptGuide = await news.scriptGuide;
    if (!scriptGuide) {
      throw NotFoundError;
    }
    const sentenceGuide: SentenceGuide =
      await this.sentenceGuideRepository.createSentenceGuide(
        scriptGuide,
        createSentenceGuideDto,
      );
    const returnSentenceGuideDto: ReturnSentenceGuideDto =
      new ReturnSentenceGuideDto(sentenceGuide);
    return returnSentenceGuideDto;
  }

  async updateSentenceDefault(
    updateSentenceDefaultDto: UpdateSentenceDefaultDto,
  ): Promise<ReturnSentenceDefaultDto> {
    const sentenceDefault: SentenceDefault =
      await this.sentenceDefaultRepository.updateSentenceDefault(
        updateSentenceDefaultDto,
      );
    const returnSentenceDefaultDto: ReturnSentenceDefaultDto =
      new ReturnSentenceDefaultDto(sentenceDefault);
    return returnSentenceDefaultDto;
  }

  async updateSentenceGuide(
    updateSentenceGuideDto: UpdateSentenceGuideDto,
  ): Promise<ReturnSentenceGuideDto> {
    const sentenceGuide: SentenceGuide =
      await this.sentenceGuideRepository.updateSentenceGuide(
        updateSentenceGuideDto,
      );
    const returnSentenceGuideDto: ReturnSentenceGuideDto =
      new ReturnSentenceGuideDto(sentenceGuide);
    return returnSentenceGuideDto;
  }

  async deleteSentenceDefault(
    sentenceDefaultId: number,
  ): Promise<ReturnSentenceDefaultDto> {
    const sentenceDefault: SentenceDefault =
      await this.sentenceDefaultRepository.deleteSentenceDefault(
        sentenceDefaultId,
      );
    const returnSentenceDefaultDto: ReturnSentenceDefaultDto =
      new ReturnSentenceDefaultDto(sentenceDefault);
    return returnSentenceDefaultDto;
  }

  async deleteSentenceGuide(
    sentenceGuideId: number,
  ): Promise<ReturnSentenceGuideDto> {
    const sentenceGuide: SentenceGuide =
      await this.sentenceGuideRepository.deleteSentenceGuide(sentenceGuideId);
    const returnSentenceGuideDto: ReturnSentenceGuideDto =
      new ReturnSentenceGuideDto(sentenceGuide);
    return returnSentenceGuideDto;
  }

  async createMemoGuide(
    createMemoGuideDto: CreateMemoGuideDto,
  ): Promise<ReturnMemoGuideDto> {
    const newsId: number = createMemoGuideDto.newsId;
    const news: News = await this.newsRepository.getNewsById(newsId);
    const scriptGuide: ScriptGuide = await news.scriptGuide;
    if (!scriptGuide) {
      throw NotFoundError;
    }
    const memoGuide: MemoGuide = await this.memoGuideRepository.createMemoGuide(
      scriptGuide,
      createMemoGuideDto,
    );
    const returnMemoGuideDto: ReturnMemoGuideDto = new ReturnMemoGuideDto(
      memoGuide,
    );
    return returnMemoGuideDto;
  }

  async deleteMemoGuide(memoGuideId: number): Promise<ReturnMemoGuideDto> {
    const memoGuide: MemoGuide = await this.memoGuideRepository.deleteMemoGuide(
      memoGuideId,
    );
    const returnMemoGuideDto: ReturnMemoGuideDto = new ReturnMemoGuideDto(
      memoGuide,
    );
    return returnMemoGuideDto;
  }

  async updateKeywordOfMemoGuide(updateKeywordMemoGuideDto: UpdateKeywordMemoGuideDto): Promise<ReturnMemoGuideDto> {
    const memoGuide: MemoGuide = await this.memoGuideRepository.updateKeywordOfMemoGuide(updateKeywordMemoGuideDto);
    const returnMemoGuideDto: ReturnMemoGuideDto = new ReturnMemoGuideDto(
      memoGuide,
    );
    return returnMemoGuideDto;
  }

  async updatefMemoGuide(updateMemoGuideDto: UpdateMemoGuideDto): Promise<ReturnMemoGuideDto> {
    const memoGuide: MemoGuide = await this.memoGuideRepository.updateMemoGuide(updateMemoGuideDto);
    const returnMemoGuideDto: ReturnMemoGuideDto = new ReturnMemoGuideDto(
      memoGuide,
    );
    return returnMemoGuideDto;
  }
}
