import { Controller, Get, Logger, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/user/user.entity';
import { UserForViewDto } from './dto/user-for-view.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { UserService } from './user.service';
import { statusCode } from 'src/modules/response/response.status.code';
import { util } from 'src/modules/response/response.util';
import { message } from 'src/modules/response/response.message';
import { getToggleInfo } from './utils/get-toggle-info';
import { TOGGLE_FAVORITE } from './dto/toggle-favorite.type';

const logger: Logger = new Logger('user controller')


@Controller('user')
export class UserController {
  constructor(private userService: UserService) {};

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(
    @Req() req,
    @Res() res
    ): Promise<Response> {
    try {
      const userInfo: ReturnUserDto = req.user;
      const data: UserForViewDto = await this.userService.getUserInfo(userInfo);
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.READ_USER_SUCCESS, data))
    
      } catch (error) {
      logger.error(error);
      return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(util.fail(statusCode.INTERNAL_SERVER_ERROR,message.INTERNAL_SERVER_ERROR))
    }
  }

  @Post('/favorite/:newsId')
  @UseGuards(JwtAuthGuard)
  async toggleFavoriteNews(
    @Req() req,
    @Res() res,
    @Param('newsId') newsId : number
  ): Promise<Response> {
    try {
      const user = req.user;
      newsId = Number(newsId);

      const addOrDelete: TOGGLE_FAVORITE = await this.userService.toggleFavoriteNews(user, newsId);
      const isFavorite: boolean = getToggleInfo(addOrDelete);

      const data: Object = {
        newsId: newsId,
        isFavorite: isFavorite,
      }

      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.TOGGLE_FAVORITE_NEWS_SUCCESS, data))
    
      } catch (error) {
      logger.error(error);
      if (error.response.statusCode === statusCode.BAD_REQUEST) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST))
      }
      return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(util.fail(statusCode.INTERNAL_SERVER_ERROR,message.INTERNAL_SERVER_ERROR))
    }
  }
}
