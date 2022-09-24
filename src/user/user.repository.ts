import { Logger } from "@nestjs/common";
import { User } from "src/user/user.entity";
import { News } from "src/news/news.entity";
import { NewsRepository } from "src/news/news.repository";
import { EntityRepository, Repository } from "typeorm";
// import { Favorite } from "./favorite.entity";


const logger = new Logger('user.repository');

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async createUser(user: User): Promise<User> {
      // await user.favorites = [];
      return user.save()
    }

    async addFavoriteNews(user: User, news: News): Promise<User> {
      const favorites = await user.favorites;
      favorites.push(news);
      user.save();
      return user;
    }
    
    async deleteFavoriteNews(user: User, news: News): Promise<User> {
      let favorites = await user.favorites;
      const newsId: number = news.id;

      user.favorites = Promise.resolve(
        favorites.filter((news) => {
          return news.id !== newsId;
        }),
      );

      user.save();
      return user;

    }
}
