import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  Res, UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { message } from 'src/modules/response/response.message';
import { statusCode } from 'src/modules/response/response.status.code';
import { util } from 'src/modules/response/response.util';
import { ReturnNewsDto } from 'src/news/dto/return-news.dto';
import { NewsService } from 'src/news/news.service';
import { User } from 'src/user/user.entity';
import { CreateMemoDto } from './dto/create-memo.dto';
import { DeleteMemoDto } from './dto/delete-memo.dto';
import { ReturnScriptDto } from './dto/return-script.dto';
import { ReturnScriptDtoCollection } from './dto/return-script.dto.collection';
import { Memo } from './entity/memo.entity';
import { Script } from './entity/script.entity';
import { Sentence } from './entity/sentence.entity';
import { ScriptService } from './script.service';
import { FileInterceptor } from "@nestjs/platform-express";

const logger: Logger = new Logger('script controller');

@Controller('script')
export class ScriptController {
  constructor(
    private scriptService: ScriptService,
    private newsService: NewsService,
    ) {};

  /*
  * 개발 테스트 로직
  */
  @Post('test/create')
  @UseGuards(JwtAuthGuard)
  async createScriptTest(
    @Req() req,
    @Res() res
  ): Promise<Response> {
    const userId: number = req.user.id;
    const newsId: number = req.body.newsId;
    const scriptName: string = req.body.name;
    const data: Script = await this.scriptService.createScript(userId, newsId, scriptName);
    return res
    .status(statusCode.OK)
    .send(util.success(statusCode.OK, message.CREATE_SCRIPT_SUCCESS, data))
  }

  @Get('test/get/all')
  async getAllScript(
    @Res() res
  ): Promise<Response> {
    const data: Script[] = await this.scriptService.getAllScript();
    return res
    .status(statusCode.OK)
    .send(util.success(statusCode.OK, message.READ_ALL_SCRIPTS_SUCCESS, data))
  }

  @Post('test/delete/:scriptId')
  async deleteScriptTest(
    @Res() res,
    @Param('scriptId') scriptId : number
  ): Promise<Response> {
    const data: Script = await this.scriptService.deleteScriptTest(scriptId);
    return res
    .status(statusCode.OK)
    .send(util.success(statusCode.OK, message.DELETE_SCRIPT_SUCCESS, data))
  }

  @Post('sentence/test/create')
  @UseGuards(JwtAuthGuard)
  async createSentence(
    @Req() req,
    @Res() res
  ): Promise<Response> {
    const scriptId: number = req.body.scriptId;
    const order: number = req.body.order;
    const startTime: number = req.body.startTime;
    const endTime: number = req.body.endTime;
    const text: string = req.body.text;
    const data: Sentence = await this.scriptService.createSentenceByScriptId(scriptId, order, startTime, endTime, text);
    return res
    .status(statusCode.OK)
    .send(util.success(statusCode.OK, message.CREATE_SENTENCE_SUCCESS, data))
  }

  // 스크립트 이름 변경 API
  @Patch('name/:scriptId')
  @UseGuards(JwtAuthGuard)
  async changeScriptName(
    @Req() req,
    @Res() res,
    @Param('scriptId') scriptId: number
  ): Promise<Response> {
    try {
      const user: User = req.user;
      const userId: number = user.id;
      const name: string = req.body.name;
      const returnNewsDto: ReturnNewsDto = await this.newsService.getNewsByScriptId(scriptId);
      const data: ReturnNewsDto = await this.newsService.checkReturnNewsDtoIsFavorite(returnNewsDto, user);
      const data2: ReturnScriptDto = await this.scriptService.changeScriptName(userId, scriptId, name);
      return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.UPDATE_SCRIPT_NAME_SUCCESS, data, data2))
    } catch (error) {
      logger.error(error)
      if (error.name === "UnauthorizedException") {
        return res
        .status(statusCode.UNAUTHORIZED)
        .send(util.fail(statusCode.UNAUTHORIZED, message.NOT_OWNER_OF_SCRIPT))
      }
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR))
    }
  }

  @Post('create/:newsId')
  @UseGuards(JwtAuthGuard)
  async createScript(
    @Req() req,
    @Res() res,
    @Param('newsId') newsId: number,
  ): Promise<Response> {
    try {
      const user: User = req.user;
      const userId: number = user.id;
      await this.scriptService.createScriptAfterCountCheck(userId, newsId);
      const returnNewsDto: ReturnNewsDto = await this.newsService.getNews(newsId);
      const data: ReturnNewsDto = await this.newsService.checkReturnNewsDtoIsFavorite(returnNewsDto, user);
      const data2: ReturnScriptDtoCollection = await this.scriptService.getScripts(userId, newsId);
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.CREATE_SCRIPT_SUCCESS, data, data2))
      } catch (error) {
        logger.error(error)
        if (error.name === "BadRequestException") {
          return res
            .status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, message.FULL_SCRIPTS_COUNT))
        }
        return res
          .status(statusCode.INTERNAL_SERVER_ERROR)
          .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR))
      }
  }

  @Delete('delete/:scriptId')
  @UseGuards(JwtAuthGuard)
  async deleteScript(
    @Req() req,
    @Res() res,
    @Param('scriptId') scriptId: number
  ): Promise<Response> {
    try {
      const user: User = req.user;
      const userId: number = user.id;
      const returnNewsDto: ReturnNewsDto = await this.newsService.getNewsByScriptId(scriptId);
      const data: ReturnNewsDto = await this.newsService.checkReturnNewsDtoIsFavorite(returnNewsDto, user);
      const data2: ReturnScriptDtoCollection = await this.scriptService.deleteAndGetScripts(userId, scriptId);
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.DELETE_SCRIPT_SUCCESS, data, data2))
      } catch (error) {
        logger.error(error)
        if (error.name === "UnauthorizedException") {
          return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, message.NOT_OWNER_OF_SCRIPT))
        }
        if (error.name === "BadRequestException") {
          return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NOT_REMOVABLE_SCRIPT))
        }
        if (error.name === "EntityNotFound") {
          return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NOT_EXISTING_SCRIPT))
        }
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR))
      }
  }

  @Post('sentence/update/:scriptId')
  @UseGuards(JwtAuthGuard)
  async updateSentence(
    @Req() req,
    @Res() res,
    @Param('scriptId') scriptId: number
  ): Promise<Response> {
    try {
      const user: User = req.user;
      const userId: number = user.id;
      const order: number = req.body.order;
      const text: string = req.body.text;
      const returnNewsDto: ReturnNewsDto = await this.newsService.getNewsByScriptId(scriptId);
      const data: ReturnNewsDto = await this.newsService.checkReturnNewsDtoIsFavorite(returnNewsDto, user);
      const data2: ReturnScriptDto = await this.scriptService.updateSentence(userId, scriptId, order, text);
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.UPDATE_SENTENCE_SUCCESS, data, data2))
    } catch (error) {
      logger.error(error)
      if (error.name === "UnauthorizedException") {
        return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, message.NOT_OWNER_OF_SCRIPT))
      }
      if (error.name === "BadRequestException") {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NOT_EXISTING_ORDER))
      }
      if (error.name === "EntityNotFound") {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NOT_EXISTING_SCRIPT))
      }
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR))
    }
  }

  @Post('memo/create/:scriptId')
  @UseGuards(JwtAuthGuard)
  async createMemo(
    @Req() req,
    @Res() res,
    @Param('scriptId') scriptId: number
  ): Promise<Response> {
    try {
      const user: User = req.user;
      const createMemoDto: CreateMemoDto = new CreateMemoDto();
      const script: Script = await this.scriptService.getScriptById(scriptId);
      
      createMemoDto.userId = user.id;
      createMemoDto.script = script;
      createMemoDto.order = req.body.order;
      createMemoDto.startIndex = req.body.startIndex;
      createMemoDto.content = req.body.content;
      const returnNewsDto: ReturnNewsDto = await this.newsService.getNewsByScriptId(scriptId);
      const data: ReturnNewsDto = await this.newsService.checkReturnNewsDtoIsFavorite(returnNewsDto, user);
      const data2: ReturnScriptDto = await this.scriptService.createMemo(createMemoDto);
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.CREATE_MEMO_SUCCESS, data, data2))
    } catch (error) {
      logger.error(error);
      if (error.name === "UnauthorizedException") {
        return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, message.NOT_OWNER_OF_SCRIPT))
      }
      if (error.name === "BadRequestException") {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NOT_EXISTING_ORDER))
      }
      if (error.name === "EntityNotFound") {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NOT_EXISTING_SCRIPT))
      }
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR))
    }
  }

  @Delete('memo/delete/:memoId')
  @UseGuards(JwtAuthGuard)
  async deleteMemo(
    @Req() req,
    @Res() res,
    @Param('memoId') memoId: number
  ): Promise<Response> {
    try {
      const user: User = req.user;
      const scriptId: number = await this.scriptService.getScriptIdByMemoId(memoId);
      const deleteMemoDto: DeleteMemoDto = new DeleteMemoDto;

      deleteMemoDto.userId = user.id;
      deleteMemoDto.scriptId = scriptId;
      deleteMemoDto.memoId = memoId;
      
      const returnNewsDto: ReturnNewsDto = await this.newsService.getNewsByScriptId(scriptId);
      const data: ReturnNewsDto = await this.newsService.checkReturnNewsDtoIsFavorite(returnNewsDto, user);
      const data2: ReturnScriptDto = await this.scriptService.deleteMemo(deleteMemoDto);
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.DELETE_MEMO_SUCCESS, data, data2))
    } catch (error) {
      console.log();
      logger.error(error);
      if (error.name === "UnauthorizedException") {
        return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, message.NOT_OWNER_OF_SCRIPT))
      }
      if (error.name === "Error") {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NOT_EXISTING_MEMO))
      }
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR))
    }
  }

  // upload recording
  @Post('/recording/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadRecording(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return this.scriptService.uploadRecordingToS3(file);
  }
}
