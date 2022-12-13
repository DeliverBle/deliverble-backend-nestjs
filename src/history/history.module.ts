import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { NewsRepository } from 'src/news/news.repository';
import { NewsService } from 'src/news/news.service';
import { ScriptRepository } from 'src/script/repository/script.repository';
import { TagRepository } from 'src/tag/tag.repository';
import { UserRepository } from 'src/user/user.repository';
import { HistoryController } from './history.controller';
import { HistoryRepository } from './history.repository';
import { HistoryService } from './history.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HistoryRepository, NewsRepository, TagRepository, ScriptRepository, UserRepository
    ]),
  ],
  controllers: [HistoryController],
  providers: [HistoryService, NewsService, AuthService, JwtService]
})
export class HistoryModule {}
