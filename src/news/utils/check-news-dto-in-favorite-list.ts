import { ExploreNewsDto } from "../dto/explore-news.dto";
import { ReturnNewsDto } from "../dto/return-news.dto";

export const checkNewsDtoInFavoriteList = (
  newsDto: ExploreNewsDto | ReturnNewsDto, favoriteList: number[]) :
  ExploreNewsDto | ReturnNewsDto => {
    if (favoriteList.includes(newsDto.id)) {
      newsDto.isFavorite = true;
      return newsDto;
    }
    return newsDto;
  }
