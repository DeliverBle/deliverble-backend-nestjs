import { Injectable, Logger } from '@nestjs/common';
import { UserForViewDto } from './dto/user-for-view.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { User } from 'src/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsRepository } from 'src/news/news.repository';
import { UserRepository } from './user.repository';
import { News } from 'src/news/news.entity';

const logger = new Logger('user.service');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(NewsRepository)
    private newsRepository: NewsRepository,
) {};

  async getUserInfo(userInfo: ReturnUserDto): Promise<UserForViewDto> {
    const userInfoForView = new UserForViewDto(
      userInfo.nickname,
      userInfo.email
      );
    return userInfoForView;
  }

  async toggleFavoriteNews(user: User, newsId: number): Promise<any> {
    const news: News = await this.newsRepository.findOne(newsId);

    const favorites = await user.favorites;
    const favoriteNewsIdList: number[] = []
    favorites.map((news) => favoriteNewsIdList.push(news.id))
    
    if ((favoriteNewsIdList.includes(newsId))) {
      return await this.userRepository.deleteFavoriteNews(user, news);
    }
    return await this.userRepository.addFavoriteNews(user, news);
  }
  
}
