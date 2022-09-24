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
      console.log(await user.favorites);
      const favorites = await user.favorites;
      // const favorite: Favorite = new Favorite(user.id, news.id);
      // console.log(favorite);
      favorites.push(news);
      // user.favorites = [news];
      console.log(user.favorites);
      user.save();

      return user;
    }
}
