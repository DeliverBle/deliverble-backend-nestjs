import { EntityRepository, Repository } from "typeorm";
import { CreateNewsDto } from "./dto/create-news.dto";
import { News } from "./news.entity";

@EntityRepository(News)
export class NewsRepository extends Repository<News> {

    async createNews(createNewsDto: CreateNewsDto): Promise<News> {
        const { 
            title, category, script, announcerGender,
            channel, link, thumbnail, startTime, endTime,
            suitability, isEmbeddable, reportDate } = createNewsDto;
        

        const news = new News(
            title, category, script, announcerGender,
            channel, link, thumbnail, startTime, endTime,
            suitability, isEmbeddable, reportDate
            );

        await this.save(news);
        return news;
    }

}
