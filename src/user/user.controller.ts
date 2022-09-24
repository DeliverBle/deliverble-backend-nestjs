import { Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/user/user.entity';
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

  @Post('/favorite/:newsId')
  @UseGuards(JwtAuthGuard)
  async toggleFavoriteNews(
    @Req() req,
    @Param('newsId') newsId : number
  ): Promise<any> {
    const user = req.user;
    newsId = Number(newsId);

    return this.userService.toggleFavoriteNews(user, newsId);
  }
}
