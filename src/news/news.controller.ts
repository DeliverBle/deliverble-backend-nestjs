import { Body, Controller, Delete, Get, Logger, Param, Post, Res } from '@nestjs/common';
import { message } from 'src/modules/response/response.message';
import { statusCode } from 'src/modules/response/response.status.code';
import { util } from 'src/modules/response/response.util';
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
	async createNews(
    @Body() createNewsDto: CreateNewsDto,
    @Res() res
    ): Promise<Response> {            
    try {
      const data: ReturnNewsDtoCollection = await this.newsService.createAndGetAllNews(createNewsDto);
      return res.status(statusCode.CREATED).send(
        util.success(
          statusCode.CREATED,
          message.CREATE_NEWS_SUCCESS,
          data
        )
      )
    } catch (error) {
      logger.error(error)
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      )
    }
  }

  @Get('all')
	async getAllNews(
    @Res() res
    ): Promise<Response> {
    try {
      const data: ReturnNewsDtoCollection = await this.newsService.getAllNews();
      return res.status(statusCode.OK).send(
        util.success(
          statusCode.OK,
          message.READ_ALL_NEWS_SUCCESS,
          data
        )
      ) 
    } catch (error) {
      logger.error(error)
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      )
    }
  }

  @Post('update/:id')
	async updateNews(
    @Body() updateNewsDto: UpdateNewsDto,
    @Param('id') id : number,
    @Res() res
    ): Promise<ReturnNewsDtoCollection> {
    try {
      const data: ReturnNewsDtoCollection = await this.newsService.updateAndGetAllNews(id, updateNewsDto);
      return res.status(statusCode.OK).send(
        util.success(
          statusCode.OK,
          message.UPDATE_NEWS_SUCCESS,
          data
        )
      ) 
    } catch (error) {
      logger.error(error)
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      )
    }
  }

  @Delete('delete/:id')
	async deleteNews(
    @Param('id') id : number,
    @Res() res
    ): Promise<ReturnNewsDtoCollection> {
    try {
      const data: ReturnNewsDtoCollection = await this.newsService.deleteAndGetAllNews(id);
      return res.status(statusCode.OK).send(
        util.success(
          statusCode.OK,
          message.DELETE_NEWS_SUCCESS,
          data
        )
      ) 
    } catch (error) {
      logger.error(error)
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      )
    }
  }
}
