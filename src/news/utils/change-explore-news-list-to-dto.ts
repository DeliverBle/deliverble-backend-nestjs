import { ExploreNewsDtoCollection } from "../dto/explore-news-collection.dto"
import { ExploreNewsDto } from "../dto/explore-news.dto"
import { News } from "../news.entity"

export const changeToExploreNewsList = (newsList: News[]): ExploreNewsDto[] => {
  const exploreNewsDtoList: ExploreNewsDto[] = newsList.map(
    (news) => new ExploreNewsDto(news)
  )
  return exploreNewsDtoList;
}
