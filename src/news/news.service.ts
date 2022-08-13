import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNewsDto } from './dto/create-news.dto';
import { News } from './news.entity';
import { NewsRepository } from './news.repository';

@Injectable()
export class NewsService {
    constructor(
        @InjectRepository(NewsRepository)
        private newsRepository: NewsRepository,
    ) {};

    async createNews(createNewsDto: CreateNewsDto) : Promise<News | void> {
		return await this.newsRepository.createNews(createNewsDto);
	}
}
