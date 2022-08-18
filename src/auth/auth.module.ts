import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { KakaoStrategy } from './kakao.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, KakaoStrategy]
})
export class AuthModule {}
