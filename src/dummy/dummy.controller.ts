import { Controller, Delete, Get, Logger, Param, Post, Put, Req, Res } from '@nestjs/common';
import { message } from 'src/modules/response/response.message';
import { statusCode } from 'src/modules/response/response.status.code';
import { util } from 'src/modules/response/response.util';
import { DUMMY_SCRIPT_TYPE } from './common/dummy-script-type.enum';
import { DummyService } from './dummy.service';
import { ScriptDefault } from './entity/script-default.entity';
import { SentenceDefault } from './entity/sentence-default.entity';

const logger: Logger = new Logger('dummy controller');

@Controller('dummy')
export class DummyController {
  constructor(private dummyService: DummyService) {};

  @Post('default/script/create')
  async createScriptDefault(
    @Req() req,
    @Res() res
  ): Promise<Response> {
    try {
      const newsId: number = req.body.newsId;

      const data: ScriptDefault = await this.dummyService.createScriptDefault(newsId);
      return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.CREATE_SCRIPT_DEFAULT_SUCCESS, data))
    } catch (error) {
      logger.error(error)
      if (error.name === "EntityNotFound") {
        return res
          .status(statusCode.NOT_FOUND)
          .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND))
      }
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR))
    }
  }

  @Get('default/script/get/:newsId')
  async getScriptDefault(
    @Res() res,
    @Param('newsId') newsId: number
  ): Promise<Response> {
    try {
      const data: ScriptDefault = await this.dummyService.getScriptDefault(newsId);
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.READ_SCRIPT_DEFAULT_SUCCESS, data))
    } catch (error) {
      logger.error(error)
      if (error.name === "TypeError") {
        return res
          .status(statusCode.NOT_FOUND)
          .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND))
      }
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR))
    }
  }

  @Delete('default/script/delete/:newsId')
  async deleteScriptDefault(
    @Res() res,
    @Param('newsId') newsId: number
  ): Promise<Response> {
    try {
      const data: ScriptDefault = await this.dummyService.deleteScriptDefault(newsId);
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.DELETE_SCRIPT_DEFAULT_SUCCESS, data))
    } catch (error) {
      logger.error(error)
      if (error.name === "TypeError") {
        return res
          .status(statusCode.NOT_FOUND)
          .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND))
      }
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR))
    }
  }

  @Post('default/sentence/create')
  async createSentenceDefault(
    @Req() req,
    @Res() res
  ): Promise<Response> {
    try {
      const newsId: number = req.body.newsId;
      const order: number = req.body.order;
      const text: string = req.body.text;
      const data: SentenceDefault = await this.dummyService.createSentenceDefault(newsId, order, text);
      return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.CREATE_SENTENCE_DEFAULT_SUCCESS, data))
    } catch (error) {
      logger.error(error)
      if (error.name === "NotFoundErrorImpl") {
        return res
          .status(statusCode.NOT_FOUND)
          .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND))
      }
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR))
    }
  }

  @Put('default/sentence/update')
  async updateSentenceDefault(
    @Req() req,
    @Res() res,
  ): Promise<Response> {
    try {
      const sentenceDefaultId: number = req.body.sentenceDefaultId;
      const order: number = req.body.order;
      const text: string = req.body.text;
      const data: SentenceDefault = await this.dummyService.updateSentenceDefault(sentenceDefaultId, order, text);
      return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.UPDATE_SENTENCE_DEFAULT_SUCCESS, data))
    } catch (error) {
      logger.error(error)
      if (error.name === "NotFoundErrorImpl") {
        return res
          .status(statusCode.NOT_FOUND)
          .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND))
      }
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR))
    }
  }

  @Delete('default/sentence/delete/:sentenceDefaultId')
  async deleteSentenceDefault(
    @Res() res,
    @Param('sentenceDefaultId') sentenceDefaultId: number
  ): Promise<Response> {
    try {
      const data: SentenceDefault = await this.dummyService.deleteSentenceDefault(sentenceDefaultId);
      return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.DELETE_SENTENCE_DEFAULT_SUCCESS, data))
    } catch (error) {
      logger.error(error)
      if (error.name === "NotFoundErrorImpl") {
        return res
          .status(statusCode.NOT_FOUND)
          .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND))
      }
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR))
    }
  }
}
