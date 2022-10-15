import { ExploreNewsDto } from "./explore-news.dto";

export class ExploreNewsDtoCollection {
  constructor(exploreNewsDtoList: ExploreNewsDto[]) {
    this.exploreNewsDtoCollection = exploreNewsDtoList;
  }

  exploreNewsDtoCollection: ExploreNewsDto[] | [];
}
