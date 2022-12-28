import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { changeReturnNewsListToDto } from 'src/news/utils/change-return-news-list-to-dto';
import { CreateEventUserDto } from './dto/create-event-user.dto';
import { EventUserRepository } from './dto/event-user.repository';
import { ReturnEventUserDto } from './dto/return-event-user.dto';
import { ReturnEventUserDtoCollection } from './dto/return-news-collection.dto copy';
import { EventUser } from './event-user.entity';
import { changeReturnEventUserListToDto } from './utils/change-return-event-user-list-to-dto';
import { checkPasswordOfEventInformation } from './utils/check-password-of-event-information';

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

  async getAllEventUserAfterCheckPassword(password: string): Promise<ReturnEventUserDtoCollection> {
    checkPasswordOfEventInformation(password);
    const eventUsers: EventUser[] = await this.eventUserRepository.find();
    const returnEventUserDtoCollection: ReturnEventUserDtoCollection = changeReturnEventUserListToDto(eventUsers);
    return returnEventUserDtoCollection;
  }
}
