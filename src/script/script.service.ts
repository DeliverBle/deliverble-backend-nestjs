import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from 'src/news/news.entity';
import { NewsRepository } from 'src/news/news.repository';
import { User } from 'src/user/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { Script } from './entity/script.entity';
import { ScriptRepository } from './repository/script.repository';

@Injectable()
export class ScriptService {
  constructor(
    @InjectRepository(ScriptRepository)
    private scriptRepository: ScriptRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(NewsRepository)
    private newsRepository: NewsRepository,
  ) {}
    
    async createScript(user: User, newsId: number, scriptName: string): Promise<Script> {
      this.userRepository.findOne()
      const news: News = await this.newsRepository.getNewsById(newsId);
      return await this.scriptRepository.createScript(user, news, scriptName);
    };

    async getAllScript(): Promise<Script[]> {
      return await this.scriptRepository.find();
    }
}
