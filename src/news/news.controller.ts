import { Body, Controller, Delete, Get, Logger, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { message } from 'src/modules/response/response.message';
import { statusCode } from 'src/modules/response/response.status.code';
import { util } from 'src/modules/response/response.util';
import { UserController } from 'src/user/user.controller';
import { User } from 'src/user/user.entity';
import { ConditionList } from './common/condition-list';
import { PaginationInfo } from './common/pagination-info';
import { SearchCondition } from './common/search-condition';
import { CreateNewsDto } from './dto/create-news.dto';
import { ExploreNewsDtoCollection } from './dto/explore-news-collection.dto';
import { ReturnNewsDtoCollection } from './dto/return-news-collection.dto';
import { ReturnNewsDto } from './dto/return-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './news.entity';
import { NewsService } from './news.service';
import { convertBodyToSearchCondition } from './utils/convert-body-to-search-condition';

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
      return res
        .status(statusCode.CREATED)
        .send(util.success(statusCode.CREATED, message.CREATE_NEWS_SUCCESS, data))
    
      } catch (error) {
      logger.error(error)
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(util.fail(statusCode.INTERNAL_SERVER_ERROR,message.INTERNAL_SERVER_ERROR))
    }
  }

  @Get('all')
	async getAllNews(
    @Res() res
    ): Promise<Response> {
    try {
      const data: ReturnNewsDtoCollection = await this.newsService.getAllNews();
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.READ_ALL_NEWS_SUCCESS,data))
    
      } catch (error) {
      logger.error(error)
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(util.fail(statusCode.INTERNAL_SERVER_ERROR,message.INTERNAL_SERVER_ERROR))
    }
  }

  @Post('update/:id')
	async updateNews(
    @Body() updateNewsDto: UpdateNewsDto,
    @Param('id') id : number,
    @Res() res
    ): Promise<Response> {
    try {
      const data: ReturnNewsDtoCollection = await this.newsService.updateAndGetAllNews(id, updateNewsDto);
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.UPDATE_NEWS_SUCCESS, data))
    
      } catch (error) {
      logger.error(error)
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(util.fail(statusCode.INTERNAL_SERVER_ERROR,message.INTERNAL_SERVER_ERROR))
    }
  }

  @Delete('delete/:id')
	async deleteNews(
    @Param('id') id : number,
    @Res() res
    ): Promise<Response> {
    try {
      const data: ReturnNewsDtoCollection = await this.newsService.deleteAndGetAllNews(id);
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.DELETE_NEWS_SUCCESS, data))
    
      } catch (error) {
      logger.error(error)
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(util.fail(statusCode.INTERNAL_SERVER_ERROR,message.INTERNAL_SERVER_ERROR))
    }
  }


  @Get('search')
	async searchNews(
    @Req() req,
    @Res() res
    ): Promise<Response> {
    try {
      const body: object = req.body;
      const searchCondition: SearchCondition = convertBodyToSearchCondition(body)
      const bearerToken: string = req.headers["authorization"];

      let data: ExploreNewsDtoCollection;
      let paginationInfo: PaginationInfo;

      // 검색 조건과 토큰 입력 -> 토큰으로 user.favorite 가져오기
      [data, paginationInfo] = await this.newsService.searchByConditions(searchCondition, bearerToken)

      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.SEARCH_NEWS_SUCCESS, [data, paginationInfo]))
    
      } catch (error) {
      logger.error(error)
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR))
    }
  }

  
}

