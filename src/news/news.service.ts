import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateResult } from 'typeorm';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './news.entity';
import { NewsRepository } from './news.repository';

const logger: Logger = new Logger('news service');

@Injectable()
export class NewsService {
    constructor(
        @InjectRepository(NewsRepository)
        private newsRepository: NewsRepository,
    ) {};

    async createNews(createNewsDto: CreateNewsDto) : Promise<News | void> {
		return await this.newsRepository.createNews(createNewsDto);
	}

    async getAllNews() : Promise<News[] | void> {
		return await this.newsRepository.getAllNews();
	}

    async updateNews(id: number, updateNewsDto: UpdateNewsDto) : Promise<News | void> {
        const updateResult: News | void = await this.newsRepository.updateNews(id, updateNewsDto);
        return updateResult;
    }

    async deleteNews(id: number) : Promise<News | void> {
        const deleteResult: News | void = await this.newsRepository.deleteNews(id);
        return deleteResult;
    }

    async createAndGetAllNews(createNewsDto: CreateNewsDto) : Promise<News[] | void> {
        await this.createNews(createNewsDto);
        return await this.getAllNews();
    }

    async updateAndGetAllNews(id: number, updateNewsDto: UpdateNewsDto) : Promise<News[] | void> {
        await this.updateNews(id, updateNewsDto);
        return await this.getAllNews();
    }

    async deleteAndGetAllNews(id: number) : Promise<News[] | void> {
        await this.deleteNews(id);
        return await this.getAllNews();
    }
}
