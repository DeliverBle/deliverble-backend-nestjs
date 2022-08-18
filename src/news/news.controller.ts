import { Body, Controller, Post } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { News } from './news.entity';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
    constructor(private newsService: NewsService) {};

    @Post('create')
	createNews(
        @Body() createNewsDto: CreateNewsDto
        ): Promise<News | void> {
		return this.newsService.createNews(createNewsDto);
	}
}
