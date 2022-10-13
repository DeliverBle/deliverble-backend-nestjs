import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsRepository } from 'src/news/news.repository';
import { DummyController } from './dummy.controller';
import { DummyService } from './dummy.service';
import { DummyScriptRepository } from './repository/dummy-script.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DummyScriptRepository, NewsRepository,
    ]),
  ],
  controllers: [DummyController],
  providers: [DummyService]
})
export class DummyModule {}
