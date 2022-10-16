import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScriptDefault } from 'src/dummy/entity/script-default.entity';
import { SentenceDefault } from 'src/dummy/entity/sentence-default.entity';
import { ScriptDefaultRepository } from 'src/dummy/repository/script-default.repository';
import { News } from 'src/news/news.entity';
import { NewsRepository } from 'src/news/news.repository';
import { User } from 'src/user/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { SCRIPT_DEFAULT_NAME } from './common/script-default-name';
import { CreateMemoDto } from './dto/create-memo.dto';
import { CreateSentenceDto } from './dto/create-sentence.dto';
import { DeleteMemoDto } from './dto/delete-memo.dto';
import { ReturnScriptDto } from './dto/return-script.dto';
import { ReturnScriptDtoCollection } from './dto/return-script.dto.collection';
import { Memo } from './entity/memo.entity';
import { Script } from './entity/script.entity';
import { Sentence } from './entity/sentence.entity';
import { MemoRepository } from './repository/memo.repository';
import { ScriptRepository } from './repository/script.repository';
import { SentenceRepository } from './repository/sentence.repository';
import { changeScriptsToReturn } from './utils/change-scripts-to-return';
import { scriptsCountCheck, SCRIPTS_COUNT_CHECK } from './utils/scripts-count-check';

const logger: Logger = new Logger('script service');

@Injectable()
export class ScriptService {
  constructor(
    @InjectRepository(ScriptRepository)
    private scriptRepository: ScriptRepository,
    @InjectRepository(SentenceRepository)
    private sentenceRepository: SentenceRepository,
    @InjectRepository(MemoRepository)
    private memoRepository: MemoRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(NewsRepository)
    private newsRepository: NewsRepository,
    @InjectRepository(ScriptDefaultRepository)
    private scriptDefaultRepository: ScriptDefaultRepository,
  ) {}
    
    async createScriptTest(userId: number, newsId: number, scriptName: string): Promise<Script> {
      const user: User = await this.userRepository.findOne(userId);
      const news: News = await this.newsRepository.getNewsById(newsId);
      return await this.scriptRepository.createScript(user, news, scriptName);
    };

    async getAllScript(): Promise<Script[]> {
      return await this.scriptRepository.find();
    }

    async getScriptById(scriptId: number): Promise<Script> {
      return await this.scriptRepository.findOneOrFail(scriptId);
    }

    async deleteScriptTest(scriptId: number): Promise<Script> {
      const scriptDeleted: Script = await this.scriptRepository.deleteScript(scriptId);
      return scriptDeleted;
    }

    async createSentence(createSentenceDto: CreateSentenceDto): Promise<Sentence> {
      return await this.sentenceRepository.createSentence(createSentenceDto);
    }

    async createSentenceByScriptId(scriptId: number, order: number, startTime: number, endTime: number, text: string): Promise<Sentence> {
      const script: Script = await this.scriptRepository.findOne(scriptId);
      const createSentenceDto: CreateSentenceDto = new CreateSentenceDto();
      createSentenceDto.script = script;
      createSentenceDto.order = order;
      createSentenceDto.startTime = startTime;
      createSentenceDto.endTime = endTime;
      createSentenceDto.text = text;
      return await this.sentenceRepository.createSentence(createSentenceDto);
    }
 
    /* 
    * 스크립트 조회
    * 로그인 한 유저가 이미 해당 News에 스크립트를 가지고 있다면 --> 가져와서 반환
    * 해당 News에 스크립트가 없다면 --> Script Default를 가져와 복사 --> 저장 후 반환
    */
    async getScripts(userId: number, newsId: number): Promise<ReturnScriptDtoCollection> {
      // userId와 newsId로 script list 가져오기
      const scripts: Script[] = await this.scriptRepository.getScriptsOfUserAndNews(userId, newsId);
      // script list의 개수에 따라 분기하기 위해, 검증 메서드 사용
      const scriptsCheck: SCRIPTS_COUNT_CHECK = scriptsCountCheck(scripts);
      // script list가 비어있다면 -> 새로 만든 후 (리스트 형식으로) 반환
      if (scriptsCheck === SCRIPTS_COUNT_CHECK.Empty) {
        const returnScriptDto: ReturnScriptDto = await this.createScript(userId, newsId);
        const returnScriptDtoCollection: ReturnScriptDtoCollection = new ReturnScriptDtoCollection([returnScriptDto]);
        return returnScriptDtoCollection;
      }
      // script list가 비어있지 않다면 -> 그대로 반환
      const returnScriptDtoList: ReturnScriptDto[] = changeScriptsToReturn(scripts);
      const returnScriptDtoCollection: ReturnScriptDtoCollection = new ReturnScriptDtoCollection(returnScriptDtoList);
      return returnScriptDtoCollection
    }

    // 새로운 스크립트 생성
    async createScript(userId: number, newsId: number): Promise<ReturnScriptDto> {
      // Script Default 가져오기
      const scriptDefault: ScriptDefault = await this.scriptDefaultRepository.getScriptDefaultByNewsId(newsId);
      // Script 객체 생성 및 저장
      const script: Script = await this.createScriptTest(userId, newsId, SCRIPT_DEFAULT_NAME);
      // Script Default가 가지고 있는 Sentence들을 list에 담고, for문으로 같은 값을 가지는 Sentence들을 생성한다.
      const sentenceDefaults: SentenceDefault[] = scriptDefault.sentenceDefaults;
      for (var i in sentenceDefaults) {
        const createSentenceDto: CreateSentenceDto = new CreateSentenceDto()
        createSentenceDto.script = script;
        createSentenceDto.order = sentenceDefaults[i].order;
        createSentenceDto.startTime = sentenceDefaults[i].startTime;
        createSentenceDto.endTime = sentenceDefaults[i].endTime;
        createSentenceDto.text = sentenceDefaults[i].text;
        await this.createSentence(createSentenceDto)
      }
      const scriptResult: Script = await this.scriptRepository.getScriptById(script.id);
      const returnScriptDto: ReturnScriptDto = new ReturnScriptDto(scriptResult);
      return returnScriptDto;
    }

    // 스크립트 이름 변경
    async changeScriptName(userId: number, scriptId: number, name: string): Promise<ReturnScriptDto> {
      // user가 script의 주인인지 확인
      const script: Script = await this.checkScriptOwner(userId, scriptId);
      script.name = name;
      script.save();
      const returnScriptDto: ReturnScriptDto = new ReturnScriptDto(script);
      return returnScriptDto;
    }

    // 스크립트 주인 확인
    async checkScriptOwner(userId: number, scriptId: number): Promise<Script> {
      const script: Script = await this.scriptRepository.findOneOrFail(scriptId);
      if (script.user.id !== userId) {
        throw UnauthorizedException;
      }
      return script;
     }

    // 유저가 스크립트 생성
    async createScriptAfterCountCheck(userId: number, newsId: number): Promise<void> {
      // userId와 newsId로 script list 가져오기
      const scripts: Script[] = await this.scriptRepository.getScriptsOfUserAndNews(userId, newsId);
      // script list의 개수에 따라 분기하기 위해, 검증 메서드 사용
      const scriptsCheck: SCRIPTS_COUNT_CHECK = scriptsCountCheck(scripts);
      if (scriptsCheck === SCRIPTS_COUNT_CHECK.Full) {
        throw BadRequestException;
      }
      await this.createScript(userId, newsId);
    };

    // 스크립트 삭제
    async deleteScript(userId: number, scriptId: number): Promise<void> {
      // user가 script의 주인인지 확인
      const script: Script = await this.checkScriptOwner(userId, scriptId);
      const scriptDeleted: Script = await this.scriptRepository.deleteScript(scriptId);
    }

    // 스크립트 조회 - scriptId만 받은 경우
    async getScriptsByScriptId(userId: number, scriptId: number): Promise<ReturnScriptDtoCollection> {
      const script: Script = await this.scriptRepository.findOneOrFail(scriptId);
      const newsId: number = script.news.id;
      return await this.getScripts(userId, newsId);
    }

    // 스크립트 삭제 후 조회
    async deleteAndGetScripts(userId: number, scriptId: number): Promise<ReturnScriptDtoCollection> {
      const script: Script = await this.scriptRepository.findOneOrFail(scriptId);
      const newsId: number = script.news.id;
      const scripts: Script[] = await this.scriptRepository.getScriptsOfUserAndNews(userId, newsId);
      if (scripts.length === 1) {
        throw BadRequestException;
      }
      await this.scriptRepository.deleteScript(scriptId);
      return await this.getScripts(userId, newsId);
    }

    // 문장 수정
    async updateSentence(userId: number, scriptId: number, order: number, text: string): Promise<ReturnScriptDto> {
      const script: Script = await this.checkScriptOwner(userId, scriptId);
      let check: boolean = false;
      script.sentences.forEach((sentence) => {
        if (sentence.order === order) {
          sentence.text = text;
          sentence.save();
          check = true;
        }
      })
      if (check === false) {
        throw BadRequestException;
      }
      const returnScriptDto: ReturnScriptDto = new ReturnScriptDto(script);
      return returnScriptDto;
    }

    // 메모 생성
    async createMemo(createMemoDto: CreateMemoDto): Promise<ReturnScriptDto> {
      const script: Script = await this.checkScriptOwner(createMemoDto.userId, createMemoDto.script.id);
      const memo: Memo = await this.memoRepository.createMemo(createMemoDto);
      // const script: Script = await this.scriptRepository()
      const returnScriptDto: ReturnScriptDto = new ReturnScriptDto(script);
      return returnScriptDto;
    }

    // 메모 삭제
    async deleteMemo(deleteMemoDto: DeleteMemoDto): Promise<ReturnScriptDto> {
      const userId: number = deleteMemoDto.userId;
      const scriptId: number = deleteMemoDto.scriptId;
      const memoId: number = deleteMemoDto.memoId;

      const script: Script = await this.checkScriptOwner(userId, scriptId);
      await this.memoRepository.deleteMemo(memoId);
      const returnScriptDto: ReturnScriptDto = new ReturnScriptDto(script);
      return returnScriptDto;
    }

    // 메모 id로 스크립트 id 가져오기
    async getScriptIdByMemoId(memoId: number): Promise<number> {
      const memo: Memo = await this.memoRepository.getMemoJoinScript(memoId);
      const scriptId: number = memo.script.id
      return scriptId;
    }

}
