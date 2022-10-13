import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { message } from 'src/modules/response/response.message';
import { statusCode } from 'src/modules/response/response.status.code';
import { util } from 'src/modules/response/response.util';
import { User } from 'src/user/user.entity';
import { Script } from './entity/script.entity';
import { ScriptService } from './script.service';

@Controller('script')
export class ScriptController {
  constructor(private scriptService: ScriptService) {};
  
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

}
