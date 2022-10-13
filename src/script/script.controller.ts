import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { message } from 'src/modules/response/response.message';
import { statusCode } from 'src/modules/response/response.status.code';
import { util } from 'src/modules/response/response.util';
import { User } from 'src/user/user.entity';
import { Script } from './entity/script.entity';
import { Sentence } from './entity/sentence.entity';
import { ScriptService } from './script.service';

@Controller('script')
export class ScriptController {
  constructor(private scriptService: ScriptService) {};
  

  /*
  * 개발 테스트 로직
  */
  @Post('test/create')
  @UseGuards(JwtAuthGuard)
  async createScript(
    @Req() req,
    @Res() res
  ): Promise<Response> {
    const user: User = req.user;
    const newsId: number = req.body.newsId;
    const scriptName: string = req.body.name;
    const data: Script = await this.scriptService.createScript(user, newsId, scriptName);
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
    const data: Sentence = await this.scriptService.createSentence(scriptId, order, text);
    return res
    .status(statusCode.OK)
    .send(util.success(statusCode.OK, message.CREATE_SENTENCE_SUCCESS, data))
  }

}
