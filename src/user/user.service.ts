import { Injectable, Logger } from '@nestjs/common';
import { UserInfoForView } from './dto/user-info-for-view.dto';
import { UserInfo } from './dto/user-info.dto';

const logger = new Logger('user.service');

@Injectable()
export class UserService {
  // async createNews(createNewsDto: CreateNewsDto) : Promise<News | void> {
	// 	return await this.newsRepository.createNews(createNewsDto);
	// }
  async getUserInfo(userInfo: UserInfo): Promise<UserInfoForView> {
    const userInfoForView = new UserInfoForView(
      userInfo.nickname,
      userInfo.email
      );
    return userInfoForView;
  }
}
