import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventUserDto } from './dto/create-event-user.dto';
import { EventUserRepository } from './dto/event-user.repository';
import { ReturnEventUserDto } from './dto/return-event-user.dto';
import { EventUser } from './event-user.entity';

const logger: Logger = new Logger('event service');

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventUserRepository)
    private eventUserRepository: EventUserRepository,
  ) {}

  async createEventUser(createEventUserDto: CreateEventUserDto): Promise<ReturnEventUserDto> {
    const eventUser: EventUser = await this.eventUserRepository.createEventUser(createEventUserDto);
    const returnEventUserDto: ReturnEventUserDto = new ReturnEventUserDto(eventUser);
    return returnEventUserDto;
  }
}
