import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateResult } from 'typeorm';
import { CreateNewsDto } from './dto/create-news.dto';
import { ReturnNewsDtoCollection } from './dto/return-news-collection.dto';
import { ReturnNewsDto } from './dto/return-news.dto';
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

    async getAllNews() : Promise<ReturnNewsDtoCollection> {
		return await this.newsRepository.getAllNews();
	}

    async updateNews(id: number, updateNewsDto: UpdateNewsDto) : Promise<ReturnNewsDto> {
        const updateResult: ReturnNewsDto = await this.newsRepository.updateNews(id, updateNewsDto);
        return updateResult;
    }

    async deleteNews(id: number) : Promise<ReturnNewsDto> {
        const deleteResult: ReturnNewsDto = await this.newsRepository.deleteNews(id);
        return deleteResult;
    }

    async createAndGetAllNews(createNewsDto: CreateNewsDto) : Promise<ReturnNewsDtoCollection> {
        await this.createNews(createNewsDto);
        return await this.getAllNews();
    }

    async updateAndGetAllNews(id: number, updateNewsDto: UpdateNewsDto) : Promise<ReturnNewsDtoCollection> {
        await this.updateNews(id, updateNewsDto);
        return await this.getAllNews();
    }

    async deleteAndGetAllNews(id: number) : Promise<ReturnNewsDtoCollection> {
        await this.deleteNews(id);
        return await this.getAllNews();
    }
}
