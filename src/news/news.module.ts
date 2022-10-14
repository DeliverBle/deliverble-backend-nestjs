import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { DummyService } from 'src/dummy/dummy.service';
import { ScriptDefaultRepository } from 'src/dummy/repository/script-default.repository';
import { SentenceDefaultRepository } from 'src/dummy/repository/sentence-default.repository';
import { TagRepository } from 'src/tag/tag.repository';
import { NewsController } from './news.controller';
import { NewsRepository } from './news.repository';
import { NewsService } from './news.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NewsRepository, TagRepository, ScriptDefaultRepository, SentenceDefaultRepository]),
    AuthModule,
  ],
  controllers: [NewsController],
  providers: [NewsService, DummyService]
})
export class NewsModule {}
