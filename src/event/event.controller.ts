import { Body, Controller, Logger, Post, Res } from '@nestjs/common';
import { message } from 'src/modules/response/response.message';
import { statusCode } from 'src/modules/response/response.status.code';
import { util } from 'src/modules/response/response.util';
import { CreateEventUserDto } from './create-event-user.dto';
import { EventService } from './event.service';
import { ReturnEventUserDto } from './return-event-user.dto';

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
