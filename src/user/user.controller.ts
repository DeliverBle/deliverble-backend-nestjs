import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/auth/user.entity';
import { UserForViewDto } from './dto/user-for-view.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {};

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Req() req): Promise<UserForViewDto> {
    const userInfo: ReturnUserDto = req.user;
    return this.userService.getUserInfo(userInfo);
  }
}
