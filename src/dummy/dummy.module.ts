import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsRepository } from 'src/news/news.repository';
import { DummyController } from './dummy.controller';
import { DummyService } from './dummy.service';
import { ScriptDefaultRepository } from './repository/script-default.repository';
import { SentenceDefaultRepository } from './repository/sentence-default.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ScriptDefaultRepository, NewsRepository, SentenceDefaultRepository,
    ]),
  ],
  controllers: [DummyController],
  providers: [DummyService]
})
export class DummyModule {}
