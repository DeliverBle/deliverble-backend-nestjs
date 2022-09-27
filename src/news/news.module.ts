import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { NewsController } from './news.controller';
import { NewsRepository } from './news.repository';
import { NewsService } from './news.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NewsRepository]),
    AuthModule,
  ],
  controllers: [NewsController],
  providers: [NewsService]
})
export class NewsModule {}
