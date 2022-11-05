import { Controller, Delete, Get, Logger, Param, Post, Put, Req, Res } from '@nestjs/common';
import { message } from 'src/modules/response/response.message';
import { statusCode } from 'src/modules/response/response.status.code';
import { util } from 'src/modules/response/response.util';
import { DUMMY_SCRIPT_TYPE } from './common/dummy-script-type.enum';
import { CreateSentenceDefaultDto } from './dto/create-sentence-default.dto';
import { ReturnScriptDefaultDto } from './dto/return-script-default.dto';
import { ReturnScriptGuideDto } from './dto/return-script-guide.dto';
import { ReturnSentenceDefaultDto } from './dto/return-sentence-default.dto';
import { UpdateSentenceDefaultDto } from './dto/update-sentence-default.dto';
import { DummyService } from './dummy.service';
import { ScriptDefault } from './entity/script-default.entity';
import { SentenceDefault } from './entity/sentence-default.entity';
import { convertBodyToCreateSentenceDefaultDto, convertBodyToUpdateSentenceDefaultDto } from './utils/convert-body-to-dto';

const logger: Logger = new Logger('dummy controller');

@Controller('dummy')
export class DummyController {
  constructor(private dummyService: DummyService) {};

  // 기본 스크립트
  @Post('default/script/create')
  async createScriptDefault(
    @Req() req,
    @Res() res
  ): Promise<Response> {
    try {
      const newsId: number = req.body.newsId;

      const returnScriptDefaultDto: ReturnScriptDefaultDto = await this.dummyService.createScriptDefault(newsId);
      return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.CREATE_SCRIPT_DEFAULT_SUCCESS, returnScriptDefaultDto))
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
      const returnScriptDefaultDto: ReturnScriptDefaultDto = await this.dummyService.getScriptDefault(newsId);
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.READ_SCRIPT_DEFAULT_SUCCESS, returnScriptDefaultDto))
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
      const returnScriptDefaultDto: ReturnScriptDefaultDto = await this.dummyService.deleteScriptDefault(newsId);
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.DELETE_SCRIPT_DEFAULT_SUCCESS, returnScriptDefaultDto))
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
      const createSentenceDefaultDto: CreateSentenceDefaultDto = convertBodyToCreateSentenceDefaultDto(req.body);
      const returnSentenceDefaultDto: ReturnSentenceDefaultDto = await this.dummyService.createSentenceDefault(createSentenceDefaultDto);
      return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.CREATE_SENTENCE_DEFAULT_SUCCESS, returnSentenceDefaultDto))
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
      const updateSentenceDefaultDto: UpdateSentenceDefaultDto = convertBodyToUpdateSentenceDefaultDto(req.body);
      const returnSentenceDefaultDto: ReturnSentenceDefaultDto = await this.dummyService.updateSentenceDefault(updateSentenceDefaultDto);
      return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.UPDATE_SENTENCE_DEFAULT_SUCCESS, returnSentenceDefaultDto))
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
      const returnSentenceDefaultDto: ReturnSentenceDefaultDto = await this.dummyService.deleteSentenceDefault(sentenceDefaultId);
      return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.DELETE_SENTENCE_DEFAULT_SUCCESS, returnSentenceDefaultDto))
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

  // 스피치 가이드
  @Post('guide/script/create')
  async createScriptGuide(
    @Req() req,
    @Res() res
  ): Promise<Response> {
    try {
      const newsId: number = req.body.newsId;

      const returnScriptGuideDto: ReturnScriptGuideDto = await this.dummyService.createScriptGuide(newsId);
      return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.CREATE_SCRIPT_DEFAULT_SUCCESS, returnScriptGuideDto))
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

  @Get('guide/script/get/:newsId')
  async getScriptGuide(
    @Res() res,
    @Param('newsId') newsId: number
  ): Promise<Response> {
    try {
      const returnScriptGuideDto: ReturnScriptGuideDto = await this.dummyService.getScriptGuide(newsId);
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.READ_SCRIPT_GUIDE_SUCCESS, returnScriptGuideDto))
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

  @Delete('guide/script/delete/:newsId')
  async deleteScriptGuide(
    @Res() res,
    @Param('newsId') newsId: number
  ): Promise<Response> {
    try {
      const returnScriptGuideDto: ReturnScriptDefaultDto = await this.dummyService.deleteScriptDefault(newsId);
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.DELETE_SCRIPT_DEFAULT_SUCCESS, returnScriptGuideDto))
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
}
