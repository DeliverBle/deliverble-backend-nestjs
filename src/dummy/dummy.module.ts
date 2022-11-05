import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsRepository } from 'src/news/news.repository';
import { DummyController } from './dummy.controller';
import { DummyService } from './dummy.service';
import { ScriptDefaultRepository } from './repository/script-default.repository';
import { ScriptGuideRepository } from './repository/script-guide.repository';
import { SentenceDefaultRepository } from './repository/sentence-default.repository';
import { SentenceGuideRepository } from './repository/sentence-guide.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ScriptDefaultRepository, NewsRepository, SentenceDefaultRepository, ScriptGuideRepository, SentenceGuideRepository,
    ]),
  ],
  controllers: [DummyController],
  providers: [DummyService]
})
export class DummyModule {}
