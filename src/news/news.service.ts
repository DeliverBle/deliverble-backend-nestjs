import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/auth.passport.jwt.strategy';
import { message } from 'src/modules/response/response.message';
import { User } from 'src/user/user.entity';
import { UpdateResult } from 'typeorm';
import { ConditionList, hasChannels, hasFindAll } from './common/condition-list';
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

const logger: Logger = new Logger('news service');

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsRepository)
    private newsRepository: NewsRepository,
    private authService: AuthService,
  ) {};

  async createNews(createNewsDto: CreateNewsDto) : Promise<ReturnNewsDto> {
		return await this.newsRepository.createNews(createNewsDto);
	}

  async getAllNews() : Promise<ReturnNewsDtoCollection> {
    const returnNewsDtoCollection: ReturnNewsDtoCollection = changeReturnNewsListToDto(
      await this.newsRepository.getAllNews()
    )
    return returnNewsDtoCollection;
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

  async filterNewsByCategory(newsList: News[], searchCondition: SearchCondition) {
    if (searchCondition.checkIfCategoryIs() === true) {
      const category: string[] = searchCondition.category;
      newsList = newsList.filter((news) => {
        if (category.includes(news.category)) {
          return news;
        }
      })
    }
    return newsList;
  }

  async filterNewsByAnnouncerGender(newsList: News[], searchCondition: SearchCondition) {
    if (searchCondition.checkIfAnnouncerGenderIs() === true) {
      const announcerGender: string[] = searchCondition.announcerGender;
      newsList = newsList.filter((news) => {
        if (announcerGender.includes(news.announcerGender)) {
          return news;
        }
      })
    }
    return newsList;
  }

  async validateNewsDataLength(newsData: News[], offset: number) {
    if (offset > newsData.length) {
      throw new Error(message.EXCEED_PAGE_INDEX);
    }
  };

  async paginateWithOffsetAndLimit(newsList: News[], searchCondition: SearchCondition): Promise<News[]> {
    const offset: number = searchCondition.getOffset();
    const limit: number = searchCondition.getLimit();
    const endIndex: number = offset + limit;

    this.validateNewsDataLength(newsList, offset);
    return newsList.slice(offset, endIndex)
  };

  async checkFavorite(exploreNewsDtoList: ExploreNewsDto[], user: User): Promise<ExploreNewsDto[]> {
    
    // let exploreNewsList: ExploreNewsDto[]  = newsList.map((news) => {
    //     let exploreNewsDto: ExploreNewsDto = new ExploreNewsDto(news);
    //     return exploreNewsDto;
    // })
    console.log(exploreNewsDtoList);
    if (user !== undefined) {
      const favoriteList: number[] = (await user.favorites).map((news) => news.id);
      console.log("favorite list:", favoriteList);
      exploreNewsDtoList = exploreNewsDtoList.map((news) => {
        if (favoriteList.includes(news.id)) {
          news.isFavorite = true;
          return news;
        } else {
          news.isFavorite = false;
          return news;
        }
      })
    }
    return exploreNewsDtoList;
  }

  async searchByConditions(searchCondition: SearchCondition, bearerToken: string | undefined): Promise<[ExploreNewsDtoCollection, PaginationInfo]> {
    let newsList: News[];
    // channel 조건에 따라 불러오기
    if (searchCondition.checkIfChannelIs() === false) {
      newsList = await this.newsRepository.getAllNews();
    } else {
      newsList = await this.newsRepository.findByChannel(searchCondition);
    }
    // category 조건으로 필터링
    newsList = await this.filterNewsByCategory(newsList, searchCondition);
    // announcerGender 조건으로 필터링
    newsList = await this.filterNewsByAnnouncerGender(newsList, searchCondition);
    
    // 페이지네이션 정보 생성
    const totalCount: number = newsList.length;
    const lastPage = getLastPage(12, totalCount);
    const paginationInfo = new PaginationInfo(totalCount, lastPage);

    // 정렬
    newsList = sortByDateAndTitle(newsList);
    // 페이지네이션
    newsList = await this.paginateWithOffsetAndLimit(newsList ,searchCondition);
    
    // 탐색창(검색 등)에 보여지는 형식으로 수정
    let exploreNewsDtoList: ExploreNewsDto[] = changeToExploreNewsList(newsList);

    // 즐겨찾기 체크 (로그인 된 유저라면)
    if (bearerToken !== undefined) {
      const user: User = await this.authService.verifyJWTReturnUser(bearerToken);
      exploreNewsDtoList = await this.checkFavorite(exploreNewsDtoList, user);
      console.log(exploreNewsDtoList);
    }

    const exploreNewsDtoCollection: ExploreNewsDtoCollection = new ExploreNewsDtoCollection(exploreNewsDtoList)
    return [exploreNewsDtoCollection, paginationInfo];
  }

}
