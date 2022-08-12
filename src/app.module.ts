import { Module } from '@nestjs/common';
import { NewsModule } from './news/news.module';

@Module({
  imports: [NewsModule],
})
export class AppModule {}
