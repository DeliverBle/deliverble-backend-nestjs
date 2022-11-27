import { ReturnNewsDtoCollection } from "../dto/return-news-collection.dto"
import { ReturnNewsDto } from "../dto/return-news.dto"
import { News } from "../news.entity"

export const changeReturnNewsListToDto = (newsList: News[]): ReturnNewsDtoCollection => {
  const returnNewsDtoList: ReturnNewsDto[] = newsList.map(
    (news) => new ReturnNewsDto(news)
    )
  const returnNewsDtoCollection: ReturnNewsDtoCollection = new ReturnNewsDtoCollection(returnNewsDtoList)
  return returnNewsDtoCollection;
}
