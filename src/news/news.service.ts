import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/auth.passport.jwt.strategy';
import { message } from 'src/modules/response/response.message';
import { User } from 'src/user/user.entity';
import { UpdateResult } from 'typeorm';
import {
  ConditionList,
  hasChannels,
  hasFindAll,
} from './common/condition-list';
import { PaginationInfo } from './common/pagination-info';
import { SearchCondition } from './common/search-condition';
import { CreateNewsDto } from './dto/create-news.dto';
import { ExploreNewsDto } from './dto/explore-news.dto';
import { ReturnNewsDtoCollection } from './dto/return-news-collection.dto';
import { ReturnNewsDto } from './dto/return-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './news.entity';
import { NewsRepository } from './news.repository';
import { changeReturnNewsListToDto } from './utils/change-return-news-list-to-dto';
import { getLastPage } from './utils/get-last-page';
import { sortByDateAndTitle } from './utils/sort-by-date-and-title';
import { VerifiedCallback } from 'passport-jwt';
import { Payload } from 'src/auth/dto/payload';
import { ExploreNewsDtoCollection } from './dto/explore-news-collection.dto';
import { changeToExploreNewsList } from './utils/change-explore-news-list-to-dto';
import { Tag } from 'src/tag/tag.entity';
import { TagRepository } from 'src/tag/tag.repository';
import { PaginationCondition } from './common/pagination-condition';
import { Script } from 'src/script/entity/script.entity';
import { ScriptRepository } from 'src/script/repository/script.repository';
import { checkUser } from './utils/check-user';
import { checkNewsDtoInFavoriteList } from './utils/check-news-dto-in-favorite-list';
import { History } from 'src/history/history.entity';
import { HistoryService } from 'src/history/history.service';

const logger: Logger = new Logger('news service');

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsRepository)
    private newsRepository: NewsRepository,
    @InjectRepository(TagRepository)
    private tagRepository: TagRepository,
    @InjectRepository(ScriptRepository)
    private scriptRepository: ScriptRepository,
    private authService: AuthService,
    private historyService: HistoryService,
  ) {}

  async createNews(createNewsDto: CreateNewsDto): Promise<ReturnNewsDto> {
    const news: News = await this.newsRepository.createNews(createNewsDto);
    const returnNewsDto: ReturnNewsDto = new ReturnNewsDto(news);
    return returnNewsDto;
  }

  async getAllNews(): Promise<ReturnNewsDtoCollection> {
    const returnNewsDtoCollection: ReturnNewsDtoCollection =
      changeReturnNewsListToDto(await this.newsRepository.getAllNews());
    return returnNewsDtoCollection;
  }

  async updateNews(
    id: number,
    updateNewsDto: UpdateNewsDto,
  ): Promise<ReturnNewsDto> {
    const news: News = await this.newsRepository.updateNews(id, updateNewsDto);
    const returnNewsDto: ReturnNewsDto = new ReturnNewsDto(news);
    return returnNewsDto;
  }

  async deleteNews(id: number): Promise<ReturnNewsDto> {
    const deletedNews: News = await this.newsRepository.deleteNews(id);
    const returnNewsDto: ReturnNewsDto = new ReturnNewsDto(deletedNews);
    return returnNewsDto;
  }

  async createAndGetAllNews(
    createNewsDto: CreateNewsDto,
  ): Promise<ReturnNewsDtoCollection> {
    await this.createNews(createNewsDto);
    return await this.getAllNews();
  }

  async updateAndGetAllNews(
    id: number,
    updateNewsDto: UpdateNewsDto,
  ): Promise<ReturnNewsDtoCollection> {
    await this.updateNews(id, updateNewsDto);
    return await this.getAllNews();
  }

  async deleteAndGetAllNews(id: number): Promise<ReturnNewsDtoCollection> {
    await this.deleteNews(id);
    return await this.getAllNews();
  }

  async addTagsToNews(
    newsId: number,
    tagListForView: string[],
    tagListForRecommend: string[],
  ): Promise<ReturnNewsDto> {
    // ??????, ?????? ????????????
    const tagsForView: Tag[] = await this.tagRepository.getTagsByNameList(
      tagListForView,
    );
    const tagsForRecommend: Tag[] = await this.tagRepository.getTagsByNameList(
      tagListForRecommend,
    );
    const news: News = await this.newsRepository.getNewsById(newsId);
    // ?????? ????????? ??????(?????? ?????????) ?????????
    const newsResetTag: News = await this.newsRepository.resetTagsOfNews(news);
    // ?????? ??????
    await this.newsRepository.addTagsForViewToNews(news, tagsForView);
    await this.newsRepository.addTagsForRecommendToNews(news, tagsForRecommend);
    // ?????? ????????????
    const newsAfterAddTags: News = await this.newsRepository.getNewsById(
      newsId,
    );
    const returnNewsDto: ReturnNewsDto = new ReturnNewsDto(newsAfterAddTags);
    return returnNewsDto;
  }

  async filterNewsByCategory(
    newsList: News[],
    searchCondition: SearchCondition,
  ) {
    if (searchCondition.checkIfCategoryIs() === true) {
      const category: string[] = searchCondition.category;
      newsList = newsList.filter((news) => {
        if (category.includes(news.category)) {
          return news;
        }
      });
    }
    return newsList;
  }

  async filterNewsByAnnouncerGender(
    newsList: News[],
    searchCondition: SearchCondition,
  ) {
    if (searchCondition.checkIfAnnouncerGenderIs() === true) {
      const announcerGender: string[] = searchCondition.announcerGender;
      newsList = newsList.filter((news) => {
        if (announcerGender.includes(news.announcerGender)) {
          return news;
        }
      });
    }
    return newsList;
  }

  async validateNewsDataLength(newsData: News[], offset: number) {
    if (offset > newsData.length) {
      throw new Error(message.EXCEED_PAGE_INDEX);
    }
  }

  async paginateWithOffsetAndLimit(
    newsList: News[],
    condition: SearchCondition | PaginationCondition,
  ): Promise<News[]> {
    const offset: number = condition.getOffset();
    const limit: number = condition.getLimit();
    const endIndex: number = offset + limit;

    this.validateNewsDataLength(newsList, offset);
    return newsList.slice(offset, endIndex);
  }

  async checkExploreNewsDtoListIsFavorite(
    exploreNewsDtoList: ExploreNewsDto[],
    user: User,
  ): Promise<ExploreNewsDto[]> {
    if (!checkUser(user)) {
      return exploreNewsDtoList;
    }
    const favoriteList: number[] = (await user.favorites).map(
      (news) => news.id,
    );
    exploreNewsDtoList = exploreNewsDtoList.map((news) => {
      return checkNewsDtoInFavoriteList(news, favoriteList);
    });
    return exploreNewsDtoList;
  }

  async checkReturnNewsDtoIsFavorite(
    returnNewsDto: ReturnNewsDto,
    user: User,
  ): Promise<ReturnNewsDto> {
    if (!checkUser(user)) {
      return returnNewsDto;
    }
    const favoriteList: number[] = (await user.favorites).map(
      (news) => news.id,
    );
    checkNewsDtoInFavoriteList(returnNewsDto, favoriteList);
    return returnNewsDto;
  }

  async searchByConditions(
    searchCondition: SearchCondition,
    bearerToken: string | undefined,
  ): Promise<[ExploreNewsDtoCollection, PaginationInfo]> {
    let newsList: News[];
    // channel ????????? ?????? ????????????
    if (searchCondition.checkIfChannelIs() === false) {
      newsList = await this.newsRepository.getAllNews();
    } else {
      newsList = await this.newsRepository.findByChannel(searchCondition);
    }
    // category ???????????? ?????????
    newsList = await this.filterNewsByCategory(newsList, searchCondition);
    // announcerGender ???????????? ?????????
    newsList = await this.filterNewsByAnnouncerGender(
      newsList,
      searchCondition,
    );

    // ?????????????????? ?????? ??????
    const totalCount: number = newsList.length;
    const lastPage = getLastPage(12, totalCount);
    const paginationInfo = new PaginationInfo(totalCount, lastPage);

    // ??????
    newsList = sortByDateAndTitle(newsList);
    // ??????????????????
    newsList = await this.paginateWithOffsetAndLimit(newsList, searchCondition);

    // ?????????(?????? ???)??? ???????????? ???????????? ??????
    let exploreNewsDtoList: ExploreNewsDto[] =
      await this.changeToExploreNewsList(newsList);

    // ???????????? ?????? (????????? ??? ????????????)
    if (bearerToken !== undefined) {
      const user: User = await this.authService.verifyJWTReturnUser(
        bearerToken,
      );
      exploreNewsDtoList = await this.checkExploreNewsDtoListIsFavorite(
        exploreNewsDtoList,
        user,
      );
    }

    const exploreNewsDtoCollection: ExploreNewsDtoCollection =
      new ExploreNewsDtoCollection(exploreNewsDtoList);
    return [exploreNewsDtoCollection, paginationInfo];
  }

  async getFavoriteNews(
    paginationCondition: PaginationCondition,
    user: User,
  ): Promise<[ExploreNewsDtoCollection, PaginationInfo]> {
    let favoriteNewsList: News[] = await user.favorites;
    // ?????????????????? ?????? ??????
    const totalCount: number = favoriteNewsList.length;
    const lastPage = getLastPage(12, totalCount);
    const paginationInfo = new PaginationInfo(totalCount, lastPage);

    // ??????
    favoriteNewsList = sortByDateAndTitle(favoriteNewsList);
    // ??????????????????
    favoriteNewsList = await this.paginateWithOffsetAndLimit(
      favoriteNewsList,
      paginationCondition,
    );

    // ?????????(?????? ???)??? ???????????? ???????????? ??????
    const exploreNewsDtoList: ExploreNewsDto[] =
      await this.changeToExploreNewsList(favoriteNewsList);
    // ???????????? ?????? true??? ??????
    exploreNewsDtoList.map((news) => (news.isFavorite = true));
    const exploreNewsDtoCollection: ExploreNewsDtoCollection =
      new ExploreNewsDtoCollection(exploreNewsDtoList);
    return [exploreNewsDtoCollection, paginationInfo];
  }

  async getHistory(
    paginationCondition: PaginationCondition,
    user: User,
  ): Promise<[ExploreNewsDtoCollection, PaginationInfo]> {
    const historyList: History[] = this.sortHistoryListByDate(
      await user.histories,
    );
    let historyNewsList: News[] = await this.getNewsListFromHistoryList(
      historyList,
    );
    // ?????????????????? ?????? ??????
    const totalCount: number = historyNewsList.length;
    const lastPage = getLastPage(12, totalCount);
    const paginationInfo = new PaginationInfo(totalCount, lastPage);
    // ??????????????????
    historyNewsList = await this.paginateWithOffsetAndLimit(
      historyNewsList,
      paginationCondition,
    );
    // ?????????(?????? ???)??? ???????????? ???????????? ??????
    let exploreNewsDtoList: ExploreNewsDto[] =
      await this.changeToExploreNewsList(historyNewsList);
    // ???????????? ??????
    exploreNewsDtoList = await this.checkExploreNewsDtoListIsFavorite(
      exploreNewsDtoList,
      user,
    );
    const exploreNewsDtoCollection: ExploreNewsDtoCollection =
      new ExploreNewsDtoCollection(exploreNewsDtoList);
    return [exploreNewsDtoCollection, paginationInfo];
  }

  async getNewsListFromHistoryList(historyList: History[]): Promise<News[]> {
    const newsList: News[] = [];
    for (const history of historyList) {
      const news: News = await this.historyService.getNewsByHistoryId(
        history.id,
      );
      newsList.push(news);
    }
    return newsList;
  }

  sortHistoryListByDate(historyList: History[]): History[] {
    historyList.sort((prev, next) => {
      const prevDate: Date = prev.date;
      const nextDate: Date = next.date;
      if (prevDate < nextDate) {
        return 1;
      }
      return -1;
    });
    return historyList;
  }

  async getRecommendedNews(
    bearerToken: string,
  ): Promise<ExploreNewsDtoCollection> {
    // ?????? ????????? ????????? ?????? ????????? ????????????
    const recommendedTag: Tag = await this.tagRepository.getRecommendedTag();
    let recommendedNewsList: News[] = await recommendedTag.forView;
    // ?????? ??? 8??? ????????????
    recommendedNewsList = await sortByDateAndTitle(recommendedNewsList);
    recommendedNewsList = recommendedNewsList.slice(0, 8);
    // ?????? ?????? ??? ??????
    let exploreNewsDtoList: ExploreNewsDto[] =
      await this.changeToExploreNewsList(recommendedNewsList);
    // ???????????? ?????? (????????? ??? ????????????)
    if (bearerToken !== undefined) {
      const user: User = await this.authService.verifyJWTReturnUser(
        bearerToken,
      );
      exploreNewsDtoList = await this.checkExploreNewsDtoListIsFavorite(
        exploreNewsDtoList,
        user,
      );
    }
    const exploreNewsDtoCollection: ExploreNewsDtoCollection =
      new ExploreNewsDtoCollection(exploreNewsDtoList);
    return exploreNewsDtoCollection;
  }

  async getSpeechGuideNews(
    bearerToken: string,
  ): Promise<ExploreNewsDtoCollection> {
    // ????????? ????????? ????????? ????????? ?????? ????????? ????????????
    const speechGuideTag: Tag = await this.tagRepository.getSpeechGuideTag();
    let speechGuideNewsList: News[] = await speechGuideTag.forRecommend;
    // ?????? ??? 4??? ????????????
    speechGuideNewsList = await sortByDateAndTitle(speechGuideNewsList);
    speechGuideNewsList = speechGuideNewsList.slice(0, 4);
    // ?????? ?????? ??? ??????
    let exploreNewsDtoList: ExploreNewsDto[] =
      await this.changeToExploreNewsList(speechGuideNewsList);
    // ???????????? ?????? (????????? ??? ????????????)
    if (bearerToken !== undefined) {
      const user: User = await this.authService.verifyJWTReturnUser(
        bearerToken,
      );
      exploreNewsDtoList = await this.checkExploreNewsDtoListIsFavorite(
        exploreNewsDtoList,
        user,
      );
    }
    const exploreNewsDtoCollection: ExploreNewsDtoCollection =
      new ExploreNewsDtoCollection(exploreNewsDtoList);
    return exploreNewsDtoCollection;
  }

  async getNews(newsId: number): Promise<ReturnNewsDto> {
    const news: News = await this.newsRepository.getNewsById(newsId);
    const returnNewsDto: ReturnNewsDto = new ReturnNewsDto(news);
    return returnNewsDto;
  }

  async getNewsIncludeFavorite(newsId: number, bearerToken: string): Promise<ReturnNewsDto> {
    const news: News = await this.newsRepository.getNewsById(newsId);
    let returnNewsDto: ReturnNewsDto = new ReturnNewsDto(news);
    // ???????????? ?????? (????????? ??? ????????????)
    if (bearerToken !== undefined) {
      const user: User = await this.authService.verifyJWTReturnUser(
        bearerToken,
      );
      returnNewsDto = await this.checkReturnNewsDtoIsFavorite(
        returnNewsDto,
        user,
      );
    }
    console.log(returnNewsDto);
    return returnNewsDto;
  }

  async getNewsByScriptId(scriptId: number): Promise<ReturnNewsDto> {
    const script: Script = await this.scriptRepository.findOneOrFail(scriptId);
    const newsId: number = script.news.id;
    return await this.getNews(newsId);
  }

  async getNewsTest(newsId: number): Promise<News> {
    return this.newsRepository.findOne(newsId);
  }

  async changeToExploreNewsList(newsList: News[]): Promise<ExploreNewsDto[]> {
    const exploreNewsDtoList: ExploreNewsDto[] = [];
    for (const news of newsList) {
      const exploreNewsDto: ExploreNewsDto = await new ExploreNewsDto(news);
      await exploreNewsDto.checkHaveGuide(news);
      exploreNewsDtoList.push(exploreNewsDto);
    }
    return exploreNewsDtoList;
  }

  async getSimilarNews(
    newsId: number,
    bearerToken: string,
  ): Promise<ExploreNewsDtoCollection> {
    const news: News = await this.newsRepository.getNewsById(newsId);
    const similarNewsList: News[] = await this.getSimilarNewsList(news);
    let exploreNewsDtoList: ExploreNewsDto[] =
      await this.changeToExploreNewsList(similarNewsList);
    // ???????????? ?????? (????????? ??? ????????????)
    if (bearerToken !== undefined) {
      const user: User = await this.authService.verifyJWTReturnUser(
        bearerToken,
      );
      exploreNewsDtoList = await this.checkExploreNewsDtoListIsFavorite(
        exploreNewsDtoList,
        user,
      );
    }
    const exploreNewsDtoCollection: ExploreNewsDtoCollection =
      new ExploreNewsDtoCollection(exploreNewsDtoList);
    return exploreNewsDtoCollection;
  }

  async getSimilarNewsList(news: News): Promise<News[]> {
    const similarMap: Map<News, number> = await this.calculateSimilarMap(news);
    const similarMapArray = await this.sortSimilarMap(similarMap);
    // ????????? ?????? 4??? ?????????
    const similarNewsList: News[] = [];
    for (let i = 0; i < 4; i++) {
      similarNewsList.push(similarMapArray[i][0]);
    }
    return similarNewsList;
  }

  async calculateSimilarMap(news: News): Promise<Map<News, number>> {
    const similarMap = new Map();
    const tagsOfNews: Tag[] = news.tagsForRecommend;
    const allNews: News[] = await this.newsRepository.find();
    for (const newsTarget of allNews) {
      if (newsTarget.id == news.id) {
        continue;
      }
      const countOfSameTags: number = await this.calculateCountOfSameTags(
        tagsOfNews,
        newsTarget,
      );
      similarMap.set(newsTarget, countOfSameTags);
    }
    console.log(similarMap);
    return similarMap;
  }

  async calculateCountOfSameTags(
    tagsOfNews: Tag[],
    news: News,
  ): Promise<number> {
    let countOfSameTags = 0;
    const tagsOfTargetNews: Tag[] = news.tagsForRecommend;
    for (const tag of tagsOfNews) {
      for (const tagTarget of tagsOfTargetNews) {
        if (tag.id == tagTarget.id) {
          countOfSameTags += 1;
        }
      }
    }
    return countOfSameTags;
  }

  async sortSimilarMap(similarMap: Map<News, number>): Promise<Object[]> {
    const mapArray: Object[] = [...similarMap.entries()].sort((prev, next) => {
      const prevCount: number = prev[1];
      const nextCount: number = next[1];
      const prevNews: News = prev[0];
      const nextNews: News = next[0];
      if (prevCount == nextCount) {
        return this.compareOrderOfTwoNews(prevNews, nextNews);
      }
      return nextCount - prevCount;
    });
    return mapArray;
  }

  compareOrderOfTwoNews(prevNews: News, nextNews: News): number {
    if (+new Date(prevNews.reportDate) == +new Date(nextNews.reportDate)) {
      const condition =
        '[]{}*!@_.()#^&%-=+01234567989abcdefghijklmnopqrstuvwxyz';
      const prev_condition = condition.indexOf(prevNews.title[0]);
      const next_condition = condition.indexOf(nextNews.title[0]);
      if (prev_condition === next_condition) {
        return prevNews.title < nextNews.title
          ? -1
          : prevNews.title > nextNews.title
          ? 1
          : 0;
      }
      return next_condition - prev_condition;
    }
    return +new Date(nextNews.reportDate) - +new Date(prevNews.reportDate);
  }
}
