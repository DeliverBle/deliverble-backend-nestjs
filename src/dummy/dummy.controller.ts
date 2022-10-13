import { Controller, Logger, Post, Req, Res } from '@nestjs/common';
import { message } from 'src/modules/response/response.message';
import { statusCode } from 'src/modules/response/response.status.code';
import { util } from 'src/modules/response/response.util';
import { DUMMY_SCRIPT_TYPE } from './common/dummy-script-type.enum';
import { DummyService } from './dummy.service';
import { DummyScript } from './entity/dummy-script.entity';

const logger: Logger = new Logger('dummy controller');

@Controller('dummy')
export class DummyController {
  constructor(private dummyService: DummyService) {};

  @Post('script/create')
  async createDummyScript(
    @Req() req,
    @Res() res
  ): Promise<Response> {
    try {
      const newsId: number = req.body.newsId;
      const dummyScriptType: DUMMY_SCRIPT_TYPE = req.body.type;
      const data: DummyScript = await this.dummyService.createDummyScript(newsId, dummyScriptType);
      return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.CREATE_DUMMY_SCRIPT_SUCCESS, data))
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

}
