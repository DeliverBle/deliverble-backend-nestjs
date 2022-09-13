import { Body, Controller, Delete, Get, Logger, Param, Post } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './news.entity';
import { NewsService } from './news.service';

const logger: Logger = new Logger('news controller');

@Controller('news')
export class NewsController {
    constructor(private newsService: NewsService) {};

    @Post('create')
	createNews(
        @Body() createNewsDto: CreateNewsDto
        ): Promise<News | void> {
		return this.newsService.createNews(createNewsDto);
	}

    @Get('all')
	getAllNews(): Promise<News[] | void> {
		return this.newsService.getAllNews();
	}

    @Post('update/:id')
	updateNews(
    @Body() updateNewsDto: UpdateNewsDto,
    @Param('id') id : number
    ): Promise<News[] | void> {
        return this.newsService.updateAndGetAllNews(id, updateNewsDto);
	}

    @Delete('delete/:id')
	deleteNews(
    @Param('id') id : number
    ): Promise<News[] | void> {
        return this.newsService.deleteAndGetAllNews(id);
	}
}
