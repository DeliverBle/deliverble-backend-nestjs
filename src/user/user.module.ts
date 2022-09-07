import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/auth.passport.jwt.strategy';
import { AuthRepository } from 'src/auth/auth.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthRepository]),
    PassportModule,
  ],  
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}

