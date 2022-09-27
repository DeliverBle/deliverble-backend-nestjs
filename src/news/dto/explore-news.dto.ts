import { Category } from "../common/category.enum";
import { Channel } from "../common/channel.enum";
import { News } from "../news.entity";

export class ExploreNewsDto {
  constructor(news: News) {
    this.id = news.id
    this.title = news.title;
    this.category = news.category;
    this.channel = news.channel;
    this.thumbnail = news.thumbnail;
    this.reportDate = news.reportDate;
    this.isFavorite = false;
}
    id: number;
    title: string;
    category: Category;
    channel: Channel;
    thumbnail: string;
    reportDate: Date;
    isFavorite: boolean;
    
}
