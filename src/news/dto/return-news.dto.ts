import { Time } from "src/modules/Time";
import { Category } from "../common/Category";
import { Channel } from "../common/Channel";
import { Gender } from "../common/Gender";
import { Suitability } from "../common/Suitability";
import { News } from "../news.entity";

export class ReturnNewsDto {
  constructor(news: News) {
    this.title = news.title;
    this.category = news.category;
    this.script = news.script;
    this.announcerGender = news.announcerGender;
    this.channel = news.channel;
    this.link = news.link;
    this.thumbnail = news.thumbnail;
    this.startTime = news.startTime;
    this.endTime = news.endTime;
    this.suitability = news.suitability;
    this.isEmbeddable = news.isEmbeddable;
    this.reportDate = news.reportDate;
}

    title: string;
    category: Category;
    script: string;
    announcerGender: Gender;
    channel: Channel;
    link: string;
    thumbnail: string;
    startTime: number;
    endTime: number;
    suitability: Suitability;
    isEmbeddable: boolean;
    reportDate: Date;
}
