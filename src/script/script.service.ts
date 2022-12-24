import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
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
import {
  SCRIPTS_COUNT_CHECK,
  scriptsCountCheck,
} from './utils/scripts-count-check';
import axios from 'axios';
import { RecordingDto } from './dto/recording.dto';
import { RecordingRepository } from './repository/recording.repository';
import { statusCode } from "../modules/response/response.status.code";
import { message } from "../modules/response/response.message";

const FormData = require('form-data');

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

  async createScript(
    userId: number,
    newsId: number,
    scriptName: string,
  ): Promise<Script> {
    const user: User = await this.userRepository.findOne(userId);
    const news: News = await this.newsRepository.getNewsById(newsId);
    return await this.scriptRepository.createScript(user, news, scriptName);
  }

  async getAllScript(): Promise<Script[]> {
    return await this.scriptRepository.find();
  }

  async getScriptById(scriptId: number): Promise<Script> {
    return await this.scriptRepository.findOneOrFail(scriptId);
  }

  async deleteScriptTest(scriptId: number): Promise<Script> {
    const scriptDeleted: Script = await this.scriptRepository.deleteScript(
      scriptId,
    );
    return scriptDeleted;
  }

  async createSentence(
    createSentenceDto: CreateSentenceDto,
  ): Promise<Sentence> {
    return await this.sentenceRepository.createSentence(createSentenceDto);
  }

  async createSentenceByScriptId(
    scriptId: number,
    order: number,
    startTime: number,
    endTime: number,
    text: string,
  ): Promise<Sentence> {
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
  async getScripts(
    userId: number,
    newsId: number,
  ): Promise<ReturnScriptDtoCollection> {
    // userId와 newsId로 script list 가져오기
    const scripts: Script[] =
      await this.scriptRepository.getScriptsOfUserAndNews(userId, newsId);
    // script list의 개수에 따라 분기하기 위해, 검증 메서드 사용
    const scriptsCheck: SCRIPTS_COUNT_CHECK = scriptsCountCheck(scripts);
    // script list가 비어있다면 -> 새로 만든 후 (리스트 형식으로) 반환
    if (scriptsCheck === SCRIPTS_COUNT_CHECK.Empty) {
      const returnScriptDto: ReturnScriptDto = await this.createScriptByDefault(
        userId,
        newsId,
      );
      const returnScriptDtoCollection: ReturnScriptDtoCollection =
        new ReturnScriptDtoCollection([returnScriptDto]);
      return returnScriptDtoCollection;
    }
    // script list가 비어있지 않다면 -> 그대로 반환
    const returnScriptDtoList: ReturnScriptDto[] =
      changeScriptsToReturn(scripts);
    const returnScriptDtoCollection: ReturnScriptDtoCollection =
      new ReturnScriptDtoCollection(returnScriptDtoList);
    return returnScriptDtoCollection;
  }

  // 새로운 스크립트 생성 (Script Default 활용)
  async createScriptByDefault(
    userId: number,
    newsId: number,
  ): Promise<ReturnScriptDto> {
    // Script Default 가져오기
    const scriptDefault: ScriptDefault =
      await this.scriptDefaultRepository.getScriptDefaultByNewsId(newsId);
    // Script 이름 설정을 위한, Script count 조회하기
    const count: number = await this.getOrCreateScriptCount(userId, newsId);
    // Script 객체 생성 및 저장
    const scriptName: string = SCRIPT_DEFAULT_NAME + count;
    const script: Script = await this.createScript(userId, newsId, scriptName);
    // Script Default가 가지고 있는 Sentence들을 list에 담고, for문으로 같은 값을 가지는 Sentence들을 생성한다.
    const sentenceDefaults: SentenceDefault[] = scriptDefault.sentenceDefaults;
    for (const i in sentenceDefaults) {
      const createSentenceDto: CreateSentenceDto = new CreateSentenceDto();
      createSentenceDto.script = script;
      createSentenceDto.order = sentenceDefaults[i].order;
      createSentenceDto.startTime = sentenceDefaults[i].startTime;
      createSentenceDto.endTime = sentenceDefaults[i].endTime;
      createSentenceDto.text = sentenceDefaults[i].text;
      await this.createSentence(createSentenceDto);
    }
    const scriptResult: Script = await this.scriptRepository.getScriptById(
      script.id,
    );
    const returnScriptDto: ReturnScriptDto = new ReturnScriptDto(scriptResult);
    return returnScriptDto;
  }

  // 스크립트 이름 생성을 위해 Script count 조회 or 생성
  async getOrCreateScriptCount(
    userId: number,
    newsId: number,
  ): Promise<number> {
    const scriptCount: ScriptCount =
      await this.scriptCountRepository.getScriptCount(userId, newsId);
    if (!scriptCount) {
      const user: User = await this.userRepository.findOneOrFail(userId);
      const scriptCount: ScriptCount =
        await this.scriptCountRepository.createScriptCount(user, newsId);
      return scriptCount.count;
    }
    scriptCount.count += 1;
    scriptCount.save();
    return scriptCount.count;
  }

  // 스크립트 이름 변경
  async changeScriptName(
    userId: number,
    scriptId: number,
    name: string,
  ): Promise<ReturnScriptDto> {
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
  async createScriptAfterCountCheck(
    userId: number,
    newsId: number,
  ): Promise<void> {
    // userId와 newsId로 script list 가져오기
    const scripts: Script[] =
      await this.scriptRepository.getScriptsOfUserAndNews(userId, newsId);
    // script list의 개수에 따라 분기하기 위해, 검증 메서드 사용
    const scriptsCheck: SCRIPTS_COUNT_CHECK = scriptsCountCheck(scripts);
    if (scriptsCheck === SCRIPTS_COUNT_CHECK.Full) {
      throw BadRequestException;
    }
    await this.createScriptByDefault(userId, newsId);
  }

  // 스크립트 삭제
  async deleteScript(userId: number, scriptId: number): Promise<void> {
    // user가 script의 주인인지 확인
    const script: Script = await this.checkScriptOwner(userId, scriptId);
    const scriptDeleted: Script = await this.scriptRepository.deleteScript(
      scriptId,
    );
  }

  // 스크립트 조회 - scriptId만 받은 경우
  async getScriptsByScriptId(
    userId: number,
    scriptId: number,
  ): Promise<ReturnScriptDtoCollection> {
    const script: Script = await this.scriptRepository.findOneOrFail(scriptId);
    const newsId: number = script.news.id;
    return await this.getScripts(userId, newsId);
  }

  // 스크립트 삭제 후 조회
  async deleteAndGetScripts(
    userId: number,
    scriptId: number,
  ): Promise<ReturnScriptDtoCollection> {
    const script: Script = await this.scriptRepository.findOneOrFail(scriptId);
    const newsId: number = script.news.id;
    const scripts: Script[] =
      await this.scriptRepository.getScriptsOfUserAndNews(userId, newsId);
    if (scripts.length === 1) {
      throw BadRequestException;
    }
    await this.scriptRepository.deleteScript(scriptId);
    return await this.getScripts(userId, newsId);
  }

  // 문장 수정
  async updateSentence(
    userId: number,
    scriptId: number,
    order: number,
    text: string,
  ): Promise<ReturnScriptDto> {
    const script: Script = await this.checkScriptOwner(userId, scriptId);
    let check = false;
    script.sentences.forEach((sentence) => {
      if (sentence.order === order) {
        sentence.text = text;
        sentence.save();
        check = true;
      }
    });
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
    const script: Script = await this.scriptRepository.findOneOrFail(scriptId);
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
    const script: Script = await this.scriptRepository.findOneOrFail(scriptId);
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
    const script: Script = await this.scriptRepository.findOneOrFail(scriptId);
    const returnScriptDto: ReturnScriptDto = new ReturnScriptDto(script);
    return returnScriptDto;
  }

  // 메모 id로 스크립트 id 가져오기
  async getScriptIdByMemoId(memoId: number): Promise<number> {
    const memo: Memo = await this.memoRepository.getMemoJoinScript(memoId);
    const scriptId: number = memo.script.id;
    return scriptId;
  }

  async uploadRecordingToS3(
    userId: number,
    scriptId: number,
    name: string,
    endtime: number,
    date: string,
    itemBuffer: Buffer,
  ) {
    const formData = new FormData();
    formData.append('file', itemBuffer, 'file_name.mp3');

    const response = await axios({
      method: 'post',
      url: 'http://localhost:8000/upload',
      data: formData,
      headers: formData.getHeaders(),
    });

    const user = await this.userRepository.findOneOrFail(userId);
    const scripts = await user.scripts;

    let script;
    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i].id == scriptId) {
        script = scripts[i];
      }
    }

    if (!script) {
      return {
        status: statusCode.NOT_FOUND,
        message: 'There is no script with this id',
      };
    }

    console.log('Recording Blob', script.recordingblob.toString());

    const recordingDtoLength = script.recordingblob
      .toString()
      .split(' @ ').length;

    console.log('recordingDtoLength', recordingDtoLength);

    const recordingDto = new RecordingDto(
      name,
      response.data['url'],
      endtime,
      false,
      date,
      recordingDtoLength,
    );

    // change recordingDto to JSON
    const recordingDtoJson = JSON.stringify(recordingDto);
    console.log('recordingDtoJson >>>>>>>>>>>>> ', recordingDtoJson);
    script.recordingblob = script.recordingblob + ' @ ' + recordingDtoJson;

    // save script
    await script.save();

    return {
      link: response.data['url'],
      name: recordingDto.name,
      scriptId: scriptId,
      date: date,
    };
  }

  async deleteRecording(userId: number, scriptId: number, link: string) {
    const user = await this.userRepository.findOneOrFail(userId);
    console.log('delete :: scriptId On Recording >>>>>>>>>>>>> ', scriptId);

    // find script by id
    const scripts = await user.scripts;
    console.log('delete :: USER SCRIPTS >>>>>>>>>>>>> ', scripts);

    let script;
    for (let i = 0; i < scripts.length; i++) {
      console.log('delete :: SCRIPTS[i] >>>>>>>>>>>>> ', scripts[i]);
      console.log('delete :: SCRIPTS[i].id >>>>>>>>>>>>> ', scripts[i].id);
      console.log('delete :: scriptId >>>>>>>>>>>>> ', scriptId);

      if (scripts[i].id == scriptId) {
        console.log('delete :: MATCHED SCRIPT >>>>>>>>>>>>> ', scripts[i]);
        script = scripts[i];
      }
    }
    console.log('delete :: SELECTED SCRIPT >>>>>>>>>>>>> ', script);

    if (!script) {
      return {
        status: 400,
        message: 'delete :: There is no script with this id',
      };
    }

    const recordinglob = script.recordingblob;
    const blobString = recordinglob.toString();

    // {"name":"hello","link":"https://deliverable-recording.s3.ap-northeast-2.amazonaws.com/1669549924.mp3","endTime":"45","isDeleted":false,"date":"2022-11-30 22:30:17"} @ {"name":"hello","link":"https://deliverable-recording.s3.ap-northeast-2.amazonaws.com/1669550000.mp3","endTime":"45","isDeleted":false,"date":"2022-11-30 22:30:17"} @ {"name":"hello","link":"https://deliverable-recording.s3.ap-northeast-2.amazonaws.com/1669550007.mp3","endTime":"45","isDeleted":false,"date":"2022-09-30 22:30:17"}
    // split by '@' then make it to json array
    const recordinglobArray = blobString.split(' @ ');
    console.log(
      'delete :: RECORDINGLOB ARRAY >>>>>>>>>>>>> ',
      recordinglobArray,
    );
    const recordinglobJsonArray = recordinglobArray.map((recordinglob) => {
      if (recordinglob == '') {
        return;
      }
      return JSON.parse(recordinglob);
    });
    console.log(
      'delete :: RECORDINGLOBJSONARRAY >>>>>>>>>>>>> ',
      recordinglobJsonArray,
    );
    // find recording by link
    const toBeDeletedRecording = recordinglobJsonArray.find((recording) => {
      if (recording == undefined || recording == '') {
        return false;
      }
      return recording.link === link;
    });
    if (!toBeDeletedRecording) {
      return {
        status: 400,
        message: 'delete :: There is no recording with this link',
      };
    }
    console.log(
      'delete :: toBeDeletedRecording >>>>>>>>>>>>> ',
      toBeDeletedRecording,
    );

    // change name
    const toBeDeletedRecordingLink = toBeDeletedRecording.link;

    // update script
    const updatedRecordinglobJsonArray = recordinglobJsonArray.map(
      (recordinglob) => {
        // if undefined or null or empty then do nothing
        if (!recordinglob || recordinglob == '') {
          return;
        }
        // if recordingLob has toBeDeletedRecordingLink then pass
        if (recordinglob.link === toBeDeletedRecordingLink) {
          return;
        }
        return JSON.stringify(recordinglob);
      },
    );

    const updatedRecordinglob = updatedRecordinglobJsonArray.join(' @ ');
    script.recordingblob = updatedRecordinglob;
    console.log('delete :: recordingblob ::', script.recordingblob);
    const responseSaved = await this.scriptRepository.save(script);
    console.log('delete :: response saved ', responseSaved);

    return {
      link: link,
      deleted: true,
      scriptId: scriptId,
    };
  }

  async changeNameOfRecording(
    userId: number,
    scriptId: number,
    link: string,
    newName: string,
  ) {
    const user = await this.userRepository.findOneOrFail(userId);

    // find script by id
    const scripts = await user.scripts;

    let script;
    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i].id == scriptId) {
        script = scripts[i];
      }
    }

    if (!script) {
      return {
        status: statusCode.NOT_FOUND,
        message: message.NOT_FOUND_SCRIPT,
      };
    }

    const recordinglob = script.recordingblob;
    const blobString = recordinglob.toString();

    // {"name":"hello","link":"https://deliverable-recording.s3.ap-northeast-2.amazonaws.com/1669549924.mp3","endTime":"45","isDeleted":false,"date":"2022-11-30 22:30:17"} @ {"name":"hello","link":"https://deliverable-recording.s3.ap-northeast-2.amazonaws.com/1669550000.mp3","endTime":"45","isDeleted":false,"date":"2022-11-30 22:30:17"} @ {"name":"hello","link":"https://deliverable-recording.s3.ap-northeast-2.amazonaws.com/1669550007.mp3","endTime":"45","isDeleted":false,"date":"2022-09-30 22:30:17"}
    // split by '@' then make it to json array
    const recordinglobArray = blobString.split(' @ ');
    console.log('RECORDINGLOB ARRAY >>>>>>>>>>>>> ', recordinglobArray);
    const recordinglobJsonArray = recordinglobArray.map((recordinglob) => {
      if (recordinglob == '') {
        return;
      }
      return JSON.parse(recordinglob);
    });
    console.log('RECORDINGLOBJSONARRAY >>>>>>>>>>>>> ', recordinglobJsonArray);
    // find recording by link
    const recording = recordinglobJsonArray.find((recording) => {
      if (recording == undefined || recording == '') {
        return false;
      }
      return recording.link === link;
    });
    if (!recording) {
      return {
        message: message.NOT_FOUND_RECORDING,
      };
    }
    console.log('RECORDING >>>>>>>>>>>>> ', recording);

    // change name
    recording.name = newName;
    // update script
    const updatedRecordinglobJsonArray = recordinglobJsonArray.map(
      (recordinglob) => {
        // if undefined or null or empty then do nothing
        if (!recordinglob || recordinglob == '') {
          return;
        }
        return JSON.stringify(recordinglob);
      },
    );
    const updatedRecordinglob = updatedRecordinglobJsonArray.join(' @ ');
    script.recordingblob = updatedRecordinglob;
    const responseSaved = await this.scriptRepository.save(script);
    console.log(responseSaved);

    return {
      link: link,
      newName: newName,
      scriptId: parseInt(String(scriptId)),
    };
  }

  async getRecordingByScriptId(userId: number, scriptId: number) {
    const allRecording = await this.getUserAllRecording(userId);
    // allRecording is like this following
    // [
    //     [
    //         {
    //             "name": "defense second",
    //             "link": "https://deliverable-recording.s3.ap-northeast-2.amazonaws.com/1669597784.mp3",
    //             "endTime": "43",
    //             "isDeleted": true,
    //             "date": "2022-05-03 17:42:30",
    //             "deleted": true,
    //             "scriptId": 63
    //         },
    //         {
    //             "name": "\b새로운 녹음",
    //             "link": "https://deliverable-recording.s3.ap-northeast-2.amazonaws.com/1669597831.mp3",
    //             "endTime": "43",
    //             "isDeleted": true,
    //             "date": "2022-05-03 17:42:30",
    //             "scriptId": 63
    //         }
    //     ],
    //     [
    //         {
    //             "name": "defense",
    //             "link": "https://deliverable-recording.s3.ap-northeast-2.amazonaws.com/1669597696.mp3",
    //             "endTime": "43",
    //             "isDeleted": false,
    //             "date": "2022-05-03 17:42:30",
    //             "scriptId": 65
    //         }
    //     ]
    // ]
    // filter by scriptId
    // make sure allRecording is not empty or undefined or null, if then, return 400
    if (!allRecording) {
      return {
        status: 400,
        message: 'There is no script on your user',
      };
    }

    // @ts-ignore
    const filteredRecording = allRecording?.filter((recording) => {
      return recording[0].scriptId == scriptId;
    });

    // if filteredRecording is empty or nil, return 400
    if (!filteredRecording) {
      return {
        status: 400,
        message: 'There is no recording with this scriptId',
      };
    }

    return filteredRecording;
  }

  async getUserAllRecording(userId: number) {
    const user = await this.userRepository.findOneOrFail(userId);
    console.log(
      'getAllUserScript :: scriptId On Recording >>>>>>>>>>>>> User ',
      user,
    );

    // find script by id
    const scripts = await user.scripts;

    if (!scripts) {
      return {
        message: message.NOT_FOUND_SCRIPT,
      };
    }

    // scripts forEach
    const recordingAllScriptsArray = [];
    scripts.forEach((script) => {
      const recordinglob = script.recordingblob;
      const blobString = recordinglob.toString();

      // {"name":"hello","link":"https://deliverable-recording.s3.ap-northeast-2.amazonaws.com/1669549924.mp3","endTime":"45","isDeleted":false,"date":"2022-11-30 22:30:17"} @ {"name":"hello","link":"https://deliverable-recording.s3.ap-northeast-2.amazonaws.com/1669550000.mp3","endTime":"45","isDeleted":false,"date":"2022-11-30 22:30:17"} @ {"name":"hello","link":"https://deliverable-recording.s3.ap-northeast-2.amazonaws.com/1669550007.mp3","endTime":"45","isDeleted":false,"date":"2022-09-30 22:30:17"}
      // split by '@' then make it to json array
      const recordinglobArray = blobString.split(' @ ');
      console.log(
        'delete :: RECORDINGLOB ARRAY >>>>>>>>>>>>> ',
        recordinglobArray,
      );
      const recordinglobJsonArray = recordinglobArray.map((recordinglob) => {
        if (recordinglob == '') {
          return;
        }
        return JSON.parse(recordinglob);
      });
      // remove null in recordinglobJsonArray
      // [
      //         null,
      //         {
      //             "name": "defense",
      //             "link": "https://deliverable-recording.s3.ap-northeast-2.amazonaws.com/1669597696.mp3",
      //             "endTime": "43",
      //             "isDeleted": false,
      //             "date": "2022-05-03 17:42:30"
      //         }
      //     ],
      const filteredRecordinglobJsonArray = recordinglobJsonArray.filter(
        (recordinglob) => {
          return recordinglob != null;
        },
      );
      // if filteredRecordinglobJsonArray is zero, do nothing
      if (filteredRecordinglobJsonArray.length === 0) {
        return;
      }
      // insert scriptId first
      const filteredRecordinglobJsonArrayWithScriptId =
        filteredRecordinglobJsonArray.map((recordinglob) => {
          recordinglob.scriptId = script.id;
          recordinglob.endTime = parseInt(recordinglob.endTime);
          return recordinglob;
        });
      recordingAllScriptsArray.push(filteredRecordinglobJsonArrayWithScriptId);
      console.log(
        'delete :: RECORDINGLOBJSONARRAY >>>>>>>>>>>>> ',
        filteredRecordinglobJsonArrayWithScriptId,
      );
    });

    return recordingAllScriptsArray;
  }
}
