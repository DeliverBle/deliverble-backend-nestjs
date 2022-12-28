import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/auth.guard';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ReturnScriptDefaultDto } from 'src/dummy/dto/return-script-default.dto';
import { ReturnScriptGuideDto } from 'src/dummy/dto/return-script-guide.dto';
import { DummyService } from 'src/dummy/dummy.service';
import { HistoryService } from 'src/history/history.service';
import { message } from 'src/modules/response/response.message';
import { statusCode } from 'src/modules/response/response.status.code';
import { util } from 'src/modules/response/response.util';
import { ReturnScriptDtoCollection } from 'src/script/dto/return-script.dto.collection';
import { ScriptService } from 'src/script/script.service';
import { User } from 'src/user/user.entity';
import { PaginationCondition } from './common/pagination-condition';
import { PaginationInfo } from './common/pagination-info';
import { SearchCondition } from './common/search-condition';
import { CreateNewsDto } from './dto/create-news.dto';
import { ExploreNewsDtoCollection } from './dto/explore-news-collection.dto';
import { ReturnNewsDtoCollection } from './dto/return-news-collection.dto';
import { ReturnNewsDto } from './dto/return-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './news.entity';
import { NewsService } from './news.service';
import { convertBodyToPaginationCondition } from './utils/convert-body-to-condition';
import { convertBodyToSearchCondition } from './utils/convert-body-to-condition';

const logger: Logger = new Logger('news controller');

@Controller('news')
export class NewsController {
  constructor(
    private newsService: NewsService,
    private scriptService: ScriptService,
    private dummyService: DummyService,
    private historyService: HistoryService,
  ) {}

  @Post('create')
  async createNews(
    @Body() createNewsDto: CreateNewsDto,
    @Res() res,
  ): Promise<Response> {
    try {
      const data: ReturnNewsDtoCollection =
        await this.newsService.createAndGetAllNews(createNewsDto);
      return res
        .status(statusCode.CREATED)
        .send(
          util.success(statusCode.CREATED, message.CREATE_NEWS_SUCCESS, data),
        );
    } catch (error) {
      logger.error(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            message.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }

  @Get('all')
  async getAllNews(@Res() res): Promise<Response> {
    try {
      const data: ReturnNewsDtoCollection = await this.newsService.getAllNews();
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.READ_ALL_NEWS_SUCCESS, data));
    } catch (error) {
      logger.error(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            message.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }

  @Post('update/:id')
  async updateNews(
    @Body() updateNewsDto: UpdateNewsDto,
    @Param('id') id: number,
    @Res() res,
  ): Promise<Response> {
    try {
      const data: ReturnNewsDtoCollection =
        await this.newsService.updateAndGetAllNews(id, updateNewsDto);
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.UPDATE_NEWS_SUCCESS, data));
    } catch (error) {
      logger.error(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            message.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }

  @Delete('delete/:id')
  async deleteNews(@Param('id') id: number, @Res() res): Promise<Response> {
    try {
      const data: ReturnNewsDtoCollection =
        await this.newsService.deleteAndGetAllNews(id);
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.DELETE_NEWS_SUCCESS, data));
    } catch (error) {
      logger.error(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            message.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }

  @Post('tag/add/:newsId')
  async addTagsToNews(
    @Req() req,
    @Res() res,
    @Param('newsId') newsId: number,
  ): Promise<Response> {
    try {
      const tagListForView: string[] = req.body.tagListForView;
      const tagListForRecommend: string[] = req.body.tagListForRecommend;
      const data: ReturnNewsDto = await this.newsService.addTagsToNews(
        newsId,
        tagListForView,
        tagListForRecommend,
      );
      return res
        .status(statusCode.OK)
        .send(
          util.success(statusCode.OK, message.ADD_TAG_TO_NEWS_SUCCESS, data),
        );
    } catch (error) {
      logger.error(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            message.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }

  @Post('search')
  async searchNews(@Req() req, @Res() res): Promise<Response> {
    try {
      const body: object = req.body;
      const searchCondition: SearchCondition =
        convertBodyToSearchCondition(body);
      const bearerToken: string = req.headers['authorization'];

      let data: ExploreNewsDtoCollection;
      let paginationInfo: PaginationInfo;

      // 검색 조건과 토큰 입력 -> 토큰으로 user.favorite 가져오기
      [data, paginationInfo] = await this.newsService.searchByConditions(
        searchCondition,
        bearerToken,
      );
      const paginationInfoObject: object = { paginationInfo: paginationInfo };

      return res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            message.SEARCH_NEWS_SUCCESS,
            data,
            paginationInfoObject,
          ),
        );
    } catch (error) {
      logger.error(error);
      if (error.name == "InvalidTokenError") {
        return res
        .status(statusCode.UNAUTHORIZED)
        .send(
          util.fail(
            statusCode.UNAUTHORIZED,
            message.INVALID_TOKEN,
          ),
        );
      }
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            message.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }

  @Post('favorite')
  @UseGuards(JwtAuthGuard)
  async getFavoriteNews(@Res() res, @Req() req): Promise<Response> {
    try {
      const user: User = req.user;
      const body: object = req.body;
      const paginationCondition: PaginationCondition =
        convertBodyToPaginationCondition(body);

      let data: ExploreNewsDtoCollection;
      let paginationInfo;

      [data, paginationInfo] = await this.newsService.getFavoriteNews(
        paginationCondition,
        user,
      );
      const paginationInfoObject: object = { paginationInfo: paginationInfo };

      return res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            message.FAVORITE_NEWS_SUCCESS,
            data,
            paginationInfoObject,
          ),
        );
    } catch (error) {
      logger.error(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            message.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }

  @Get('recommend')
  async getRecommendedNews(@Req() req, @Res() res): Promise<Response> {
    try {
      const bearerToken: string = req.headers['authorization'];
      const data: ExploreNewsDtoCollection =
        await this.newsService.getRecommendedNews(bearerToken);
      return res
        .status(statusCode.OK)
        .send(
          util.success(statusCode.OK, message.RECOMMENDED_NEWS_SUCCESS, data),
        );
    } catch (error) {
      logger.error(error);
      if (error.name == "InvalidTokenError") {
        return res
        .status(statusCode.UNAUTHORIZED)
        .send(
          util.fail(
            statusCode.UNAUTHORIZED,
            message.INVALID_TOKEN,
          ),
        );
      }
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            message.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }

  @Get('detail/not-authentication/:newsId')
  async newsDetailNotAuthenticated(
    @Res() res,
    @Param('newsId') newsId: number,
  ): Promise<Response> {
    try {
      const data: ReturnNewsDto = await this.newsService.getNews(newsId);
      const data2: ReturnScriptDefaultDto[] = [
        await this.dummyService.getScriptDefault(newsId),
      ];
      return res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            message.READ_NEWS_DETAIL_SUCCESS,
            data,
            data2,
          ),
        );
    } catch (error) {
      logger.error(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            message.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }

  @Get('detail/:newsId')
  @UseGuards(JwtAuthGuard)
  async newsDetailAuthenticated(
    @Req() req,
    @Res() res,
    @Param('newsId') newsId: number,
  ): Promise<Response> {
    const userId: number = req.user.id;
    const user: User = req.user;
    try {
      const returnNewsDto: ReturnNewsDto = await this.newsService.getNews(
        newsId,
      );
      const data: ReturnNewsDto =
        await this.newsService.checkReturnNewsDtoIsFavorite(
          returnNewsDto,
          user,
        );
      const data2: ReturnScriptDtoCollection =
        await this.scriptService.getScripts(userId, newsId);
      this.historyService.fetchHistory(user, newsId);
      return res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            message.READ_NEWS_DETAIL_SUCCESS,
            data,
            data2.returnScriptDtoCollection,
          ),
        );
    } catch (error) {
      logger.error(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            message.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }

  @Get('test/get/:newsId')
  async getNewsTest(
    @Res() res,
    @Param('newsId') newsId: number,
  ): Promise<Response> {
    const data: News = await this.newsService.getNewsTest(newsId);
    return res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, message.READ_NEWS_DETAIL_SUCCESS, data),
      );
  }

  @Get('guide')
  async getSpeechGuideNews(@Req() req, @Res() res): Promise<Response> {
    try {
      const bearerToken: string = req.headers['authorization'];
      const data: ExploreNewsDtoCollection =
        await this.newsService.getSpeechGuideNews(bearerToken);
      return res
        .status(statusCode.OK)
        .send(
          util.success(statusCode.OK, message.SPEECH_GUIDE_NEWS_SUCCESS, data),
        );
    } catch (error) {
      logger.error(error);
      if (error.name == "InvalidTokenError") {
        return res
        .status(statusCode.UNAUTHORIZED)
        .send(
          util.fail(
            statusCode.UNAUTHORIZED,
            message.INVALID_TOKEN,
          ),
        );
      }
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            message.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }

  @Get('guide/detail/:newsId')
  async newsDetailOfSpeechGuide(
    @Req() req,
    @Res() res,
    @Param('newsId') newsId: number,
  ): Promise<Response> {
    try {
      const bearerToken: string = req.headers['authorization'];
      // const data: ReturnNewsDto = await this.newsService.getNews(newsId);
      const data: ReturnNewsDto = await this.newsService.getNewsIncludeFavorite(newsId, bearerToken);
      const data2: ReturnScriptGuideDto[] = [
        await this.dummyService.getScriptGuide(newsId),
      ];
      return res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            message.SPEECH_GUIDE_NEWS_DETAIL_SUCCESS,
            data,
            data2,
          ),
        );
    } catch (error) {
      logger.error(error);
      if (error.name == "InvalidTokenError") {
        return res
        .status(statusCode.UNAUTHORIZED)
        .send(
          util.fail(
            statusCode.UNAUTHORIZED,
            message.INVALID_TOKEN,
          ),
        );
      }
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            message.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }

  @Get('similar/:newsId')
  async saveSimilarNews(
    @Req() req,
    @Res() res,
    @Param('newsId') newsId: number,
  ): Promise<Response> {
    try {
      const bearerToken: string = req.headers['authorization'];
      // await this.newsService.saveSimilarNews(bearerToken);
      const data: ExploreNewsDtoCollection =
        await this.newsService.getSimilarNews(newsId, bearerToken);
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.SAVE_SIMILAR_NEWS, data));
    } catch (error) {
      logger.error(error);
      if (error.name == "InvalidTokenError") {
        return res
        .status(statusCode.UNAUTHORIZED)
        .send(
          util.fail(
            statusCode.UNAUTHORIZED,
            message.INVALID_TOKEN,
          ),
        );
      }
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            message.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }

  @Post('history')
  @UseGuards(JwtAuthGuard)
  async getHistory(@Res() res, @Req() req): Promise<Response> {
    try {
      const user: User = req.user;
      const body: object = req.body;
      const paginationCondition: PaginationCondition =
        convertBodyToPaginationCondition(body);

      let data: ExploreNewsDtoCollection;
      let paginationInfo;

      [data, paginationInfo] = await this.newsService.getHistory(
        paginationCondition,
        user,
      );
      const paginationInfoObject: object = { paginationInfo: paginationInfo };

      return res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            message.HISTORY_SUCCESS,
            data,
            paginationInfoObject,
          ),
        );
    } catch (error) {
      logger.error(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            message.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }
}
