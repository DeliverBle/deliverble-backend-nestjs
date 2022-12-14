import { Body, Controller, Get, Logger, Param, Post, Res } from '@nestjs/common';
import { message } from 'src/modules/response/response.message';
import { statusCode } from 'src/modules/response/response.status.code';
import { util } from 'src/modules/response/response.util';
import { CreateEventUserDto } from './dto/create-event-user.dto';
import { EventService } from './event.service';
import { ReturnEventUserDto } from './dto/return-event-user.dto';
import { ReturnEventUserDtoCollection } from './dto/return-news-collection.dto copy';

const logger: Logger = new Logger('event controller');

@Controller('event')
export class EventController {
  constructor(
    private eventService: EventService,
  ) {}

  @Post('user')
  async createEventUser(
    @Body() createEventUserDto: CreateEventUserDto,
    @Res() res,
  ): Promise<Response> {
    try {
      const data: ReturnEventUserDto =
        await this.eventService.createEventUser(createEventUserDto);
      return res
        .status(statusCode.CREATED)
        .send(
          util.success(statusCode.CREATED, message.CREATE_EVENT_USER_SUCCESS, data),
        );
    } catch (error) {
      logger.error(error);
      if (error.name === "QueryFailedError") {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(util.fail(statusCode.BAD_REQUEST, message.TOO_LONG_NICKNAME));
      }
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            message.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }

  @Get('user/all/:password')
  async getAllEventUser(
    @Res() res,
    @Param('password') password: string,
  ): Promise<Response> {
    try {
      const data: ReturnEventUserDtoCollection =
        await this.eventService.getAllEventUserAfterCheckPassword(password);
      return res
        .status(statusCode.OK)
        .send(
          util.success(statusCode.OK, message.READ_ALL_EVENT_USER, data),
        );
    } catch (error) {
      logger.error(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            message.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }
}
