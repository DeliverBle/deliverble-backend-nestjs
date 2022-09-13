import { EntityRepository, Repository, UpdateResult } from "typeorm";
import { CreateNewsDto } from "./dto/create-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";
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

    async getAllNews(): Promise<News[]> {
        return await this.find();
    }

    async getNewsById(id: number): Promise<News> {
        return await this.findOne({
            id: id
        })
    }

    async updateNews(id: number, updateNewsDto: UpdateNewsDto): Promise<News | void> {
        await this.update(
            { id: id },
                updateNewsDto
            )
        
        return await this.getNewsById(id);
    }

}
