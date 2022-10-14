import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScriptDefault } from 'src/dummy/entity/script-default.entity';
import { SentenceDefault } from 'src/dummy/entity/sentence-default.entity';
import { ScriptDefaultRepository } from 'src/dummy/repository/script-default.repository';
import { News } from 'src/news/news.entity';
import { NewsRepository } from 'src/news/news.repository';
import { User } from 'src/user/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { SCRIPT_DEFAULT_NAME } from './common/script-default-name';
import { Script } from './entity/script.entity';
import { Sentence } from './entity/sentence.entity';
import { ScriptRepository } from './repository/script.repository';
import { SentenceRepository } from './repository/sentence.repository';
import { scriptsCountCheck, SCRIPTS_COUNT_CHECK } from './utils/scripts-count-check';

const logger: Logger = new Logger('script service');

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
    @InjectRepository(ScriptDefaultRepository)
    private scriptDefaultRepository: ScriptDefaultRepository,
  ) {}
    
    async createScript(userId: number, newsId: number, scriptName: string): Promise<Script> {
      const user: User = await this.userRepository.findOne(userId);
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

    async createSentence(script: Script, order: number, text: string): Promise<Sentence> {
      // const script: Script = await this.scriptRepository.findOne(scriptId);
      return await this.sentenceRepository.createSentence(script, order, text)
    }

    async createSentenceByScriptId(scriptId: number, order: number, text: string): Promise<Sentence> {
      const script: Script = await this.scriptRepository.findOne(scriptId);
      return await this.sentenceRepository.createSentence(script, order, text)
    }
 
    /* 
    * 로그인 한 유저가 이미 해당 News에 스크립트를 가지고 있다면 --> 가져와서 반환
    * 해당 News에 스크립트가 없다면 --> Script Default를 가져와 복사 --> 저장 후 반환
    */
    async getScripts(userId: number, newsId: number): Promise<Script[]> {
      // userId와 newsId로 script list 가져오기
      const scripts: Script[] = await this.scriptRepository.getScriptsOfUserAndNews(userId, newsId);
      // script list의 개수에 따라 분기하기 위해, 검증 메서드 사용
      const scriptsCheck: SCRIPTS_COUNT_CHECK = scriptsCountCheck(scripts);
      // script list가 비어있다면 -> 새로 만든 후 (리스트 형식으로) 반환
      if (scriptsCheck === SCRIPTS_COUNT_CHECK.Empty) {
        const script: Script = await this.createScriptOfUser(userId, newsId);
        return [script]
      }
      // script list가 비어있지 않다면 -> 그대로 반환
      return scripts;
    }

    // 새로운 스크립트 생성
    async createScriptOfUser(userId: number, newsId: number): Promise<Script> {
      // Script Default 가져오기
      const scriptDefault: ScriptDefault = await this.scriptDefaultRepository.getScriptDefaultByNewsId(newsId);
      // Script 객체 생성 및 저장
      const script: Script = await this.createScript(userId, newsId, SCRIPT_DEFAULT_NAME);
      // Script Default가 가지고 있는 Sentence들을 list에 담고, for문으로 같은 값을 가지는 Sentence들을 생성한다.
      const sentenceDefaults: SentenceDefault[] = scriptDefault.sentenceDefaults;
      for (var i in sentenceDefaults) {
        await this.createSentence(script, sentenceDefaults[i].order, sentenceDefaults[i].text)
      }
      return await this.scriptRepository.getScriptById(script.id);
    }

}
