import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsRepository } from 'src/news/news.repository';
import { UserRepository } from 'src/user/user.repository';
import { ScriptController } from './script.controller';
import { ScriptRepository } from './repository/script.repository';
import { ScriptService } from './script.service';
import { SentenceRepository } from './repository/sentence.repository';
import { ScriptDefaultRepository } from 'src/dummy/repository/script-default.repository';
import { NewsService } from 'src/news/news.service';
import { TagRepository } from 'src/tag/tag.repository';
import { AuthService } from 'src/auth/auth.service';
import { MemoRepository } from './repository/memo.repository';
import { ScriptCountRepository } from './repository/script-count.repository';
import { HistoryService } from 'src/history/history.service';
import { HistoryRepository } from 'src/history/history.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ScriptRepository, SentenceRepository, MemoRepository, UserRepository, NewsRepository, ScriptDefaultRepository, TagRepository, ScriptCountRepository, HistoryRepository,
    ]),
  ],
  controllers: [ScriptController],
  providers: [ScriptService, JwtModule, NewsService, AuthService, JwtService, HistoryService]
})
export class ScriptModule {}
