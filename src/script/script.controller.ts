import { Body, Controller, Get, Logger, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { message } from 'src/modules/response/response.message';
import { statusCode } from 'src/modules/response/response.status.code';
import { util } from 'src/modules/response/response.util';
import { ReturnNewsDto } from 'src/news/dto/return-news.dto';
import { NewsService } from 'src/news/news.service';
import { User } from 'src/user/user.entity';
import { ReturnScriptDto } from './dto/return-script.dto';
import { ReturnScriptDtoCollection } from './dto/return-script.dto.collection';
import { Script } from './entity/script.entity';
import { Sentence } from './entity/sentence.entity';
import { ScriptService } from './script.service';

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
    const data: Script = await this.scriptService.createScriptTest(userId, newsId, scriptName);
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
  async deleteScript(
    @Res() res,
    @Param('scriptId') scriptId : number
  ): Promise<Response> {
    const data: Script = await this.scriptService.deleteScript(scriptId);
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
    const text: string = req.body.text;
    const data: Sentence = await this.scriptService.createSentenceByScriptId(scriptId, order, text);
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
    const userId: number = req.user.id;
    const name: string = req.body.name;
    try {
      const data: ReturnNewsDto = await this.newsService.getNewsByScriptId(scriptId);
      const data2: ReturnScriptDto = await this.scriptService.changeScriptName(userId, scriptId, name);
      return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.UPDATE_SCRIPT_NAME_SUCCESS, data, data2))
    } catch (error) {
      logger.error(error)
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
    const userId: number = req.user.id;
    try {
      await this.scriptService.createScriptAfterCountCheck(userId, newsId);
      const data: ReturnNewsDto = await this.newsService.getNews(newsId);
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

}
