import { ScriptGuide } from "src/dummy/entity/script-guide.entity";
import { Category } from "../common/category.enum";
import { Channel } from "../common/channel.enum";
import { News } from "../news.entity";

export class ExploreNewsDto {
  constructor(news: News) {
    this.id = news.id;
    this.title = news.title;
    this.category = news.category;
    this.channel = news.channel;
    this.thumbnail = news.thumbnail;
    this.reportDate = news.reportDate;
    this.isFavorite = false;
    this.checkHaveGuide(news);
}
    id: number;
    title: string;
    category: Category;
    channel: Channel;
    thumbnail: string;
    reportDate: Date;
    isFavorite: boolean;
    haveGuide: boolean;

    async checkHaveGuide(news: News): Promise<void> {
      const scriptGuide: ScriptGuide = await news.scriptGuide;
      if (!scriptGuide) {
        this.haveGuide = false
        console.log("haveGuide is false");
        return;
      }
      console.log("haveGuide is true");
      this.haveGuide = true;
    }
    
}
