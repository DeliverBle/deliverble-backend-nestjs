import { ScriptGuide } from "src/dummy/entity/script-guide.entity";
import { Tag } from "src/tag/tag.entity";
import { Category } from "../common/category.enum";
import { Channel } from "../common/channel.enum";
import { Gender } from "../common/gender.enum";
import { Suitability } from "../common/suitability.enum";
import { News } from "../news.entity";

export class ReturnNewsDto {
  constructor(news: News) {
    this.checkHaveGuide(news);
    this.id = news.id
    this.title = news.title;
    this.category = news.category;
    this.announcerGender = news.announcerGender;
    this.channel = news.channel;
    this.link = news.link;
    this.thumbnail = news.thumbnail;
    this.startTime = news.startTime;
    this.endTime = news.endTime;
    this.suitability = news.suitability;
    this.isEmbeddable = news.isEmbeddable;
    this.reportDate = news.reportDate;
    this.isFavorite = false;
    this.tagsForView = news.tagsForView;
  }
  id: number;
  title: string;
  category: Category;
  announcerGender: Gender;
  channel: Channel;
  link: string;
  thumbnail: string;
  startTime: number;
  endTime: number;
  suitability: Suitability;
  isEmbeddable: boolean;
  reportDate: Date;
  isFavorite: boolean;
  tagsForView?: Tag[];
  haveGuide: boolean;

  async checkHaveGuide(news: News): Promise<void> {
    const scriptGuide: ScriptGuide = await news.scriptGuide;
    if (!scriptGuide) {
      this.haveGuide = false
      return;
    }
    this.haveGuide = true;
  }
}
