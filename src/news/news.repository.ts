import { Tag } from "src/tag/tag.entity";
import { EntityRepository, Repository, UpdateResult } from "typeorm";
import { SearchCondition } from "./common/search-condition";
import { CreateNewsDto } from "./dto/create-news.dto";
import { ReturnNewsDtoCollection } from "./dto/return-news-collection.dto";
import { ReturnNewsDto } from "./dto/return-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { News } from "./news.entity";
import { changeReturnNewsListToDto } from "./utils/change-return-news-list-to-dto";

@EntityRepository(News)
export class NewsRepository extends Repository<News> {

    async createNews(createNewsDto: CreateNewsDto): Promise<News> {
        const { 
            title, category, announcerGender,
            channel, link, thumbnail, startTime, endTime,
            suitability, isEmbeddable, reportDate } = createNewsDto;
        

        const news = new News(
            title, category, announcerGender,
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
        const news: News = await this.findOneOrFail({
            id: id
        })
        return news;
    }

    async resetTagsOfNews(news: News): Promise<News> {
        news.tagsForView = [];
        news.tagsForRecommend = [];
        news.save();
        return news;
    }

    async addTagsForViewToNews(news: News, tagsForView: Tag[]): Promise<News> {
        tagsForView.forEach((tag) => { 
            news.tagsForView.push(tag);
        })
        news.save(); 
        return news;
    }

    async addTagsForRecommendToNews(news: News, tagsForRecommend: Tag[]): Promise<News> {
        tagsForRecommend.forEach((tag) => { 
            news.tagsForRecommend.push(tag);
        })
        news.save();        
        return news;
    }

    async updateNews(id: number, updateNewsDto: UpdateNewsDto): Promise<News> {
        await this.update(
            { id: id },
                updateNewsDto
            )
        return await this.getNewsById(id);
    }

    async deleteNews(id: number): Promise<News> {
        const news: News = await this.getNewsById(id);
        await this.delete(
            { id: id }
        )
        return news;
    }

    async findByChannel(searchCondition: SearchCondition): Promise<News[]> {
        const channels: string[] = searchCondition.channel;
        return await this.createQueryBuilder('news')
          .where('news.channel IN (:...channels)', { channels })
          .getMany();
    };
}
