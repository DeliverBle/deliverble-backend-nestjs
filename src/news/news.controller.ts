import { Body, Controller, Delete, Get, Logger, Param, Post } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { ReturnNewsDtoCollection } from './dto/return-news-collection.dto';
import { ReturnNewsDto } from './dto/return-news.dto';
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
        ): Promise<ReturnNewsDtoCollection> {            
		return this.newsService.createAndGetAllNews(createNewsDto);
	}

    @Get('all')
	getAllNews(): Promise<ReturnNewsDtoCollection> {
		return this.newsService.getAllNews();
	}

    @Post('update/:id')
	updateNews(
    @Body() updateNewsDto: UpdateNewsDto,
    @Param('id') id : number
    ): Promise<ReturnNewsDtoCollection> {
        return this.newsService.updateAndGetAllNews(id, updateNewsDto);
	}

    @Delete('delete/:id')
	deleteNews(
    @Param('id') id : number
    ): Promise<ReturnNewsDtoCollection> {
        return this.newsService.deleteAndGetAllNews(id);
	}
}
