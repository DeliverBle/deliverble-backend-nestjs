import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScriptDefault } from 'src/dummy/entity/script-default.entity';
import { SentenceDefault } from 'src/dummy/entity/sentence-default.entity';
import { ScriptDefaultRepository } from 'src/dummy/repository/script-default.repository';
import { News } from 'src/news/news.entity';
import { NewsRepository } from 'src/news/news.repository';
import { User } from 'src/user/user.entity';
const FormData = require('form-data');
import { UserRepository } from 'src/user/user.repository';
import { SCRIPT_DEFAULT_NAME } from './common/script-default-name';
import { CreateMemoDto } from './dto/create-memo.dto';
import { CreateSentenceDto } from './dto/create-sentence.dto';
import { DeleteMemoDto as UpdataMemoDto } from './dto/delete-memo.dto';
import { ReturnScriptDto } from './dto/return-script.dto';
import { ReturnScriptDtoCollection } from './dto/return-script.dto.collection';
import { UpdateMemoDto } from './dto/update-memo.dto';
import { Memo } from './entity/memo.entity';
import { ScriptCount } from './entity/script-count.entity';
import { Script } from './entity/script.entity';
import { Sentence } from './entity/sentence.entity';
import { MemoRepository } from './repository/memo.repository';
import { ScriptCountRepository } from './repository/script-count.repository';
import { ScriptRepository } from './repository/script.repository';
import { SentenceRepository } from './repository/sentence.repository';
import { changeScriptsToReturn } from './utils/change-scripts-to-return';
import { scriptsCountCheck, SCRIPTS_COUNT_CHECK } from './utils/scripts-count-check';
import axios from "axios";
import { Blob } from 'buffer'
import { Recording } from "./entity/recording.entity";
import { RecordingDto } from "./dto/recording.dto";
import { RecordingRepository } from "./repository/recording.repository";

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
    @InjectRepository(ScriptCountRepository)
    private scriptCountRepository: ScriptCountRepository,
    @InjectRepository(RecordingRepository)
    private recordingRepository: RecordingRepository,
  ) {}
    
    async createScript(userId: number, newsId: number, scriptName: string): Promise<Script> {
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
        const returnScriptDto: ReturnScriptDto = await this.createScriptByDefault(userId, newsId);
        const returnScriptDtoCollection: ReturnScriptDtoCollection = new ReturnScriptDtoCollection([returnScriptDto]);
        return returnScriptDtoCollection;
      }
      // script list가 비어있지 않다면 -> 그대로 반환
      const returnScriptDtoList: ReturnScriptDto[] = changeScriptsToReturn(scripts);
      const returnScriptDtoCollection: ReturnScriptDtoCollection = new ReturnScriptDtoCollection(returnScriptDtoList);
      return returnScriptDtoCollection
    }

    // 새로운 스크립트 생성 (Script Default 활용)
    async createScriptByDefault(userId: number, newsId: number): Promise<ReturnScriptDto> {
      // Script Default 가져오기
      const scriptDefault: ScriptDefault = await this.scriptDefaultRepository.getScriptDefaultByNewsId(newsId);
      // Script 이름 설정을 위한, Script count 조회하기
      const count: number = await this.getOrCreateScriptCount(userId, newsId);
      // Script 객체 생성 및 저장
      const scriptName: string = SCRIPT_DEFAULT_NAME + count;
      const script: Script = await this.createScript(userId, newsId, scriptName);
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

    // 스크립트 이름 생성을 위해 Script count 조회 or 생성
    async getOrCreateScriptCount(userId: number, newsId: number): Promise<number> {
      const scriptCount: ScriptCount = await this.scriptCountRepository.getScriptCount(userId, newsId);
      if (!scriptCount) {
        const user: User = await this.userRepository.findOneOrFail(userId);
        const scriptCount: ScriptCount = await this.scriptCountRepository.createScriptCount(user, newsId);
        return scriptCount.count;
      }
      scriptCount.count += 1;
      scriptCount.save();
      return scriptCount.count;
    }

    // 스크립트 이름 변경
    async changeScriptName(userId: number, scriptId: number, name: string): Promise<ReturnScriptDto> {
      // user가 script의 주인인지 확인
      const script: Script = await this.checkScriptOwner(userId, scriptId);
      script.name = name;
      await script.save();
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
      await this.createScriptByDefault(userId, newsId);
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
      const scriptId: number = createMemoDto.script.id;
      await this.checkScriptOwner(createMemoDto.userId, scriptId);
      await this.memoRepository.createMemo(createMemoDto);
      const script: Script = await this.scriptRepository.findOneOrFail(scriptId)
      const returnScriptDto: ReturnScriptDto = new ReturnScriptDto(script);
      return returnScriptDto;
    }

    // 메모 삭제
    async deleteMemo(deleteMemoDto: UpdataMemoDto): Promise<ReturnScriptDto> {
      const userId: number = deleteMemoDto.userId;
      const scriptId: number = deleteMemoDto.scriptId;
      const memoId: number = deleteMemoDto.memoId;

      await this.checkScriptOwner(userId, scriptId);
      await this.memoRepository.deleteMemo(memoId);
      const script: Script = await this.scriptRepository.findOneOrFail(scriptId)
      const returnScriptDto: ReturnScriptDto = new ReturnScriptDto(script);
      return returnScriptDto;
    }

    // 메모 수정
    async updateMemo(updateMemoDto: UpdateMemoDto): Promise<ReturnScriptDto> {
      const userId: number = updateMemoDto.userId;
      const scriptId: number = updateMemoDto.scriptId;
      const memoId: number = updateMemoDto.memoId;

      await this.checkScriptOwner(userId, scriptId);
      await this.memoRepository.updateMemo(updateMemoDto);
      const script: Script = await this.scriptRepository.findOneOrFail(scriptId)
      const returnScriptDto: ReturnScriptDto = new ReturnScriptDto(script);
      return returnScriptDto;
    }

    // 메모 id로 스크립트 id 가져오기
    async getScriptIdByMemoId(memoId: number): Promise<number> {
      const memo: Memo = await this.memoRepository.getMemoJoinScript(memoId);
      const scriptId: number = memo.script.id
      return scriptId;
    }

    async uploadRecordingToS3(userId: number, scriptId: number, name: string, endtime: number, date: string, item: Express.Multer.File) {
      console.log("item", item);
      const formData = new FormData();
      formData.append('file', JSON.stringify(item), 'file_name.mp3');

      const response = await axios({
        method: 'post',
        url: 'http://localhost:8000/upload',
        data: formData,
        headers: {
          'Content-Type': `multipart/form-data;`,
        },
      });

      const user = await this.userRepository.findOneOrFail(userId);
      console.log("USER >>>>>>>>>>>>>>>>> ", user);
      const scripts = await user.scripts;
      console.log("SCRIPTS >>>>>>>>>>>>> ", scripts);

      let script;
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].id == scriptId) {
          script = scripts[i];
        }
      }

      if (!script) {
        return {
          status: 400,
          message: "There is no script with this id",
        }
      }

      // upload new recording to script
      const recordingDto = new RecordingDto();
      recordingDto.name = name;
      recordingDto.link = response.data['url'];
      recordingDto.endTime = endtime;
      recordingDto.isDeleted = false;
      recordingDto.date = date;
      recordingDto.script = script;

      await this.recordingRepository.createRecording(recordingDto);

      const testScript = await this.getScriptsByScriptId(userId, scriptId);
      console.log("TEST SCRIPT >>>>>>>> ", testScript);

      // // update script
      // const updatedScript = script.addNewRecording(recording);
      // console.log("BEFORE REPO SAVED SCRIPT >>>>>>>>>> ", updatedScript);
      // const savedScript = await updatedScript.save();
      // console.log("updatedScript >>>>>>>>>>>>>>> ", savedScript);

      // const repositorySavedScript = await this.scriptRepository.updateScript(user, updatedScript, scriptId);
      // const receiptSavedUpdatedScript = await this.scriptRepository.save(updatedScript);
      // console.log("REPO SAVED SCRIPT >>>>>>>>>> ", repositorySavedScript);

      // await user.updateExistingScript(updatedScript);
      // console.log("AFTER USER updateExistingScript ", user, user.scripts)
      // const responseUserSaved = await this.userRepository.save(user);
      //
      // // console.log('responseScriptSaved >>> ', receiptSavedUpdatedScript);
      // console.log('responseUserSaved >>> ', responseUserSaved);

      return {
        link: response.data['url'],
        name: name,
        userId: userId,
        scriptId: scriptId,
        date: date
      }
    }

  async deleteRecording(userId: string, scriptId: string, name: string) {
    // find user by userId
    const user = await this.userRepository.findOneOrFail(userId);
    // find script by scriptId
    const scripts = await user.scripts;
    // find recording by name
    const script = scripts.find((script) => script.id === Number(scriptId));
    // change script's isdeleted to true
    const recording = (await script.recordings).find(
      (recording) => recording.name === name,
    );
    recording.isDeleted = true;
    // update script
    const responseSaved = await this.scriptRepository.save(script);
    console.log(responseSaved);

    return {
      name: name,
      userId: userId,
      scriptId: scriptId,
      isDeleted: true,
    }
  }

  async changeNameOfRecording(userId: string, scriptId: string, oldName: string, newName: string) {
    // find user by userId
    const user = await this.userRepository.findOneOrFail(userId);
    // find script by scriptId
    const scripts = await user.scripts;
    // find recording by name
    const script = scripts.find((script) => script.id === Number(scriptId));
    // change script's name
    const recording = (await script.recordings).find(
      (recording) => recording.name === oldName,
    );
    recording.name = newName;
    // update script
    const responseSaved = await this.scriptRepository.save(script);
    console.log(responseSaved);

    return {
      oldName: oldName,
      newName: newName,
      userId: userId,
      scriptId: scriptId,
    };
  }
}
