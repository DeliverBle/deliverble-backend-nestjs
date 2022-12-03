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
import { Tag } from 'src/tag/tag.entity';
import { TagRepository } from 'src/tag/tag.repository';
import { PaginationCondition } from './common/pagination-condition';
import { Script } from 'src/script/entity/script.entity';
import { ScriptRepository } from 'src/script/repository/script.repository';
import { checkUser } from './utils/check-user';
import { checkNewsDtoInFavoriteList } from './utils/check-news-dto-in-favorite-list';

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
  ) {};

  async createNews(createNewsDto: CreateNewsDto) : Promise<ReturnNewsDto> {
		const news: News = await this.newsRepository.createNews(createNewsDto);
    const returnNewsDto: ReturnNewsDto = new ReturnNewsDto(news);
    return returnNewsDto;
	}

  async getAllNews() : Promise<ReturnNewsDtoCollection> {
    const returnNewsDtoCollection: ReturnNewsDtoCollection = changeReturnNewsListToDto(
      await this.newsRepository.getAllNews()
    )
    return returnNewsDtoCollection;
	}

  async updateNews(id: number, updateNewsDto: UpdateNewsDto) : Promise<ReturnNewsDto> {
    const news: News = await this.newsRepository.updateNews(id, updateNewsDto);
    const returnNewsDto: ReturnNewsDto = new ReturnNewsDto(news);
    return returnNewsDto;
  }

  async deleteNews(id: number) : Promise<ReturnNewsDto> {
    const deletedNews: News = await this.newsRepository.deleteNews(id);
    const returnNewsDto: ReturnNewsDto = new ReturnNewsDto(deletedNews);
    return returnNewsDto;
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

  async addTagsToNews(
    newsId: number,
    tagListForView: string[],
    tagListForRecommend: string[]
  ): Promise<ReturnNewsDto> {
    // 태그, 뉴스 불러오기
    const tagsForView: Tag[] = await this.tagRepository.getTagsByNameList(tagListForView);
    const tagsForRecommend: Tag[] = await this.tagRepository.getTagsByNameList(tagListForRecommend);
    const news: News = await this.newsRepository.getNewsById(newsId);
    // 해당 뉴스의 태그(화면 표시용) 초기화
    const newsResetTag: News = await this.newsRepository.resetTagsOfNews(news);
    // 태그 추가
    await this.newsRepository.addTagsForViewToNews(news, tagsForView);
    await this.newsRepository.addTagsForRecommendToNews(news, tagsForRecommend);
    // 뉴스 불러오기
    const newsAfterAddTags: News = await this.newsRepository.getNewsById(newsId);
    const returnNewsDto: ReturnNewsDto = new ReturnNewsDto(newsAfterAddTags);
    return returnNewsDto;
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

  async paginateWithOffsetAndLimit(newsList: News[], condition: SearchCondition | PaginationCondition): Promise<News[]> {
    const offset: number = condition.getOffset();
    const limit: number = condition.getLimit();
    const endIndex: number = offset + limit;

    this.validateNewsDataLength(newsList, offset);
    return newsList.slice(offset, endIndex)
  };

  async checkExploreNewsDtoListIsFavorite(exploreNewsDtoList: ExploreNewsDto[], user: User): Promise<ExploreNewsDto[]> {
    if (!checkUser(user)) {
      return exploreNewsDtoList;
    }
    const favoriteList: number[] = (await user.favorites).map((news) => news.id);
    exploreNewsDtoList = exploreNewsDtoList.map((news) => {
      return checkNewsDtoInFavoriteList(news, favoriteList);
    })
    return exploreNewsDtoList;
  }

  async checkReturnNewsDtoIsFavorite(returnNewsDto: ReturnNewsDto, user: User): Promise<ReturnNewsDto> {
    if (!checkUser(user)) {
      return returnNewsDto;
    }
    const favoriteList: number[] = (await user.favorites).map((news) => news.id);
    checkNewsDtoInFavoriteList(returnNewsDto, favoriteList)
    return returnNewsDto;
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
    let exploreNewsDtoList: ExploreNewsDto[] = await this.changeToExploreNewsList(newsList);

    // 즐겨찾기 체크 (로그인 된 유저라면)
    if (bearerToken !== undefined) {
      const user: User = await this.authService.verifyJWTReturnUser(bearerToken);
      exploreNewsDtoList = await this.checkExploreNewsDtoListIsFavorite(exploreNewsDtoList, user);
    }

    const exploreNewsDtoCollection: ExploreNewsDtoCollection = new ExploreNewsDtoCollection(exploreNewsDtoList)
    return [exploreNewsDtoCollection, paginationInfo];
  }

  async getFavoriteNews(paginationCondition: PaginationCondition, user: User): Promise<[ExploreNewsDtoCollection, PaginationInfo]> {
    let favoriteNewsList: News[] = await user.favorites;
    // 페이지네이션 정보 생성
    const totalCount: number = favoriteNewsList.length;
    const lastPage = getLastPage(12, totalCount);
    const paginationInfo = new PaginationInfo(totalCount, lastPage);

    // 정렬
    favoriteNewsList = sortByDateAndTitle(favoriteNewsList);
    // 페이지네이션
    favoriteNewsList = await this.paginateWithOffsetAndLimit(favoriteNewsList ,paginationCondition);
    
    // 탐색창(검색 등)에 보여지는 형식으로 수정
    let exploreNewsDtoList: ExploreNewsDto[] = await this.changeToExploreNewsList(favoriteNewsList);
    // 즐겨찾기 여부 true로 수정
    exploreNewsDtoList.map((news) => news.isFavorite = true);
    const exploreNewsDtoCollection: ExploreNewsDtoCollection = new ExploreNewsDtoCollection(exploreNewsDtoList)
    return [exploreNewsDtoCollection, paginationInfo];
    
  }

  async getRecommendedNews(bearerToken: string): Promise<ExploreNewsDtoCollection> {
    // 추천 태그에 포함된 뉴스 리스트 가져오기
    const recommendedTag: Tag = await this.tagRepository.getRecommendedTag();
    let recommendedNewsList: News[] = await recommendedTag.forView;
    // 정렬 후 8개 슬라이싱
    recommendedNewsList = await sortByDateAndTitle(recommendedNewsList);
    recommendedNewsList = recommendedNewsList.slice(0, 8);
    // 타입 변경 후 반환
    let exploreNewsDtoList: ExploreNewsDto[] = await this.changeToExploreNewsList(recommendedNewsList);
    // 즐겨찾기 체크 (로그인 된 유저라면)
    if (bearerToken !== undefined) {
      const user: User = await this.authService.verifyJWTReturnUser(bearerToken);
      exploreNewsDtoList = await this.checkExploreNewsDtoListIsFavorite(exploreNewsDtoList, user);
    }
    const exploreNewsDtoCollection: ExploreNewsDtoCollection = new ExploreNewsDtoCollection(exploreNewsDtoList)
    return exploreNewsDtoCollection;
  }

  async getSpeechGuideNews(bearerToken: string): Promise<ExploreNewsDtoCollection> {
    // 스피치 가이드 태그에 포함된 뉴스 리스트 가져오기
    const speechGuideTag: Tag = await this.tagRepository.getSpeechGuideTag();
    let speechGuideNewsList: News[] = await speechGuideTag.forRecommend;
    // 정렬 후 4개 슬라이싱
    speechGuideNewsList = await sortByDateAndTitle(speechGuideNewsList);
    speechGuideNewsList = speechGuideNewsList.slice(0, 4);
    // 타입 변경 후 반환
    let exploreNewsDtoList: ExploreNewsDto[] = await this.changeToExploreNewsList(speechGuideNewsList);
    // 즐겨찾기 체크 (로그인 된 유저라면)
    if (bearerToken !== undefined) {
      const user: User = await this.authService.verifyJWTReturnUser(bearerToken);
      exploreNewsDtoList = await this.checkExploreNewsDtoListIsFavorite(exploreNewsDtoList, user);
    }
    const exploreNewsDtoCollection: ExploreNewsDtoCollection = new ExploreNewsDtoCollection(exploreNewsDtoList)
    return exploreNewsDtoCollection;
  }

  async getNews(newsId: number): Promise<ReturnNewsDto> {
    const news: News = await this.newsRepository.getNewsById(newsId);
    const returnNewsDto: ReturnNewsDto = new ReturnNewsDto(news);
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
    let exploreNewsDtoList: ExploreNewsDto[] = [];
    for (const news of newsList) {
      const exploreNewsDto: ExploreNewsDto = await new ExploreNewsDto(news);
      await exploreNewsDto.checkHaveGuide(news);
      exploreNewsDtoList.push(exploreNewsDto);
    }
    return exploreNewsDtoList;
  }

}



