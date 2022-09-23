import { EntityRepository, Repository, UpdateResult } from "typeorm";
import { CreateNewsDto } from "./dto/create-news.dto";
import { ReturnNewsDtoCollection } from "./dto/return-news-collection.dto";
import { ReturnNewsDto } from "./dto/return-news.dto";
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

    async getAllNews(): Promise<ReturnNewsDtoCollection> {
        const newsList: News[] = await this.find();
        const returnNewsDtoList: ReturnNewsDto[] = newsList.map(
            (news: News) => new ReturnNewsDto(news)
            )
        const returnNewsDtoCollection: ReturnNewsDtoCollection = new ReturnNewsDtoCollection(returnNewsDtoList)
        return returnNewsDtoCollection;
    }

    async getNewsById(id: number): Promise<ReturnNewsDto> {
        const news: News = await this.findOne({
            id: id
        })
        const returnNewsDto: ReturnNewsDto = new ReturnNewsDto(news);
        return returnNewsDto
    }

    async updateNews(id: number, updateNewsDto: UpdateNewsDto): Promise<ReturnNewsDto> {
        await this.update(
            { id: id },
                updateNewsDto
            )
        return await this.getNewsById(id);
    }

    async deleteNews(id: number): Promise<ReturnNewsDto> {
        const news: ReturnNewsDto = await this.getNewsById(id);
        await this.delete(
            { id: id }
        )
        return news;
    }

}
