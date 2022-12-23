import { Module } from '@nestjs/common';
import { EventUserRepository } from './dto/event-user.repository';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([
    EventUserRepository
  ])],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
