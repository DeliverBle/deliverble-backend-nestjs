import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { KakaoStrategy } from './kakao.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
  ],
  controllers: [AuthController],
  providers: [AuthService, KakaoStrategy]
})
export class AuthModule {}

