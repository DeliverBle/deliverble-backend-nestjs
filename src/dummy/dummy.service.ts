import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from 'src/news/news.entity';
import { NewsRepository } from 'src/news/news.repository';
import { DUMMY_SCRIPT_TYPE } from './common/dummy-script-type.enum';
import { DummyScript } from './entity/dummy-script.entity';
import { DummyScriptRepository } from './repository/dummy-script.repository';

@Injectable()
export class DummyService {
  constructor(
    @InjectRepository(NewsRepository)
    private newsRepository: NewsRepository,
    @InjectRepository(DummyScriptRepository)
    private dummyScriptRepository: DummyScriptRepository,
  ) {}

  async createDummyScript(newsId: number, dummyScriptType: DUMMY_SCRIPT_TYPE): Promise<DummyScript> {
    const news: News = await this.newsRepository.findOneOrFail(newsId)
    return await this.dummyScriptRepository.createDummyScript(news, dummyScriptType);
  }
}
