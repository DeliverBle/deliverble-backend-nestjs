import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/auth/user.entity';
import { UserInfoForView } from './dto/user-info-for-view.dto';
import { UserInfo } from './dto/user-info.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {};

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Req() req): Promise<UserInfoForView> {
    const userInfo: UserInfo = req.user;
    return this.userService.getUserInfo(userInfo);
  }
}
