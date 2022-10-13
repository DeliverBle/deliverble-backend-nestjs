import { Module } from '@nestjs/common';
import { NewsModule } from './news/news.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TagModule } from './tag/tag.module';
import { ScriptModule } from './script/script.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    NewsModule,
    AuthModule,
    UserModule,
    TagModule,
    ScriptModule,
  ],
})
export class AppModule {}
