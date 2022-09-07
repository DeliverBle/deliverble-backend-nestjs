import { Injectable, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './auth.passport.jwt.strategy';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
// import { KakaoStrategy } from './kakao.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthRepository]),
    JwtModule.register({
      secret: 'SECRET',
      signOptions: { expiresIn: '300s' },
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
