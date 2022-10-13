import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsRepository } from 'src/news/news.repository';
import { UserRepository } from 'src/user/user.repository';
import { ScriptController } from './script.controller';
import { ScriptRepository } from './repository/script.repository';
import { ScriptService } from './script.service';
import { SentenceRepository } from './repository/sentence.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ScriptRepository, UserRepository, NewsRepository, SentenceRepository
    ]),
  ],
  controllers: [ScriptController],
  providers: [ScriptService, JwtModule]
})
export class ScriptModule {}
