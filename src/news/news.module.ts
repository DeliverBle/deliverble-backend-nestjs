import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { DummyService } from 'src/dummy/dummy.service';
import { MemoGuideRepository } from 'src/dummy/repository/memo-guide.repository';
import { ScriptDefaultRepository } from 'src/dummy/repository/script-default.repository';
import { ScriptGuideRepository } from 'src/dummy/repository/script-guide.repository';
import { SentenceDefaultRepository } from 'src/dummy/repository/sentence-default.repository';
import { SentenceGuideRepository } from 'src/dummy/repository/sentence-guide.repository';
import { HistoryRepository } from 'src/history/history.repository';
import { HistoryService } from 'src/history/history.service';
import { MemoRepository } from 'src/script/repository/memo.repository';
import { ScriptCountRepository } from 'src/script/repository/script-count.repository';
import { ScriptRepository } from 'src/script/repository/script.repository';
import { SentenceRepository } from 'src/script/repository/sentence.repository';
import { ScriptService } from 'src/script/script.service';
import { TagRepository } from 'src/tag/tag.repository';
import { UserRepository } from 'src/user/user.repository';
import { NewsController } from './news.controller';
import { NewsRepository } from './news.repository';
import { NewsService } from './news.service';
import { RecordingRepository } from '../script/repository/recording.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NewsRepository,
      TagRepository,
      ScriptRepository,
      SentenceRepository,
      UserRepository,
      ScriptDefaultRepository,
      SentenceDefaultRepository,
      MemoRepository,
      ScriptCountRepository,
      ScriptGuideRepository,
      SentenceGuideRepository,
      MemoGuideRepository,
      RecordingRepository,
      HistoryRepository,
    ]),
    AuthModule,
  ],
  controllers: [NewsController],
  providers: [NewsService, ScriptService, DummyService, HistoryService],
})
export class NewsModule {}
