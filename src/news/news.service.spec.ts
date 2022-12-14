import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './common/category.enum';
import { Channel } from './common/channel.enum';
import { Gender } from './common/gender.enum';
import { Suitability } from './common/suitability.enum';
import { CreateNewsDto } from './dto/create-news.dto';
import { ReturnNewsDto } from './dto/return-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsController } from './news.controller';
import { News } from './news.entity';
import { NewsRepository } from './news.repository';
import { NewsService } from './news.service';

const mockNews: News = new News(
  'test title',
  Category.SOCIETY,
  Gender.WOMEN,
  Channel.KBS,
  'test link',
  'test thumbnail',
  3,
  53,
  Suitability.HIGH,
  true,
  new Date(),
);
mockNews.id = 1;

const MockNewsRepository = () => ({
  async createNews(createNewsDto: CreateNewsDto): Promise<News> {
    const {
      title,
      category,
      script,
      announcerGender,
      channel,
      link,
      thumbnail,
      startTime,
      endTime,
      suitability,
      isEmbeddable,
      reportDate,
    } = createNewsDto;

    const news = new News(
      title,
      category,
      announcerGender,
      channel,
      link,
      thumbnail,
      startTime,
      endTime,
      suitability,
      isEmbeddable,
      reportDate,
    );

    return news;
  },

  async updateNews(
    id: number,
    updateNewsDto: UpdateNewsDto,
  ): Promise<ReturnNewsDto> {
    const {
      title,
      category,
      announcerGender,
      channel,
      link,
      thumbnail,
      startTime,
      endTime,
      suitability,
      isEmbeddable,
      reportDate,
    } = updateNewsDto;

    const news = new News(
      title,
      category,
      announcerGender,
      channel,
      link,
      thumbnail,
      startTime,
      endTime,
      suitability,
      isEmbeddable,
      reportDate,
    );
    const returnNewsDto: ReturnNewsDto = new ReturnNewsDto(news);
    return returnNewsDto;
  },
});

describe('NewsService', () => {
  let newsService: NewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsService,
        {
          provide: getRepositoryToken(NewsRepository),
          useValue: MockNewsRepository(),
        },
      ],
    }).compile();

    newsService = module.get<NewsService>(NewsService);
  });

  it('should be defined', () => {
    expect(newsService).toBeDefined();
  });

  describe('createNews() : ?????? ??????', () => {
    it('SUCCESS: ?????? ?????? ??????', async () => {
      const createNewsDto: CreateNewsDto = {
        title: 'test title',
        category: Category.SOCIETY,
        script: 'test script',
        announcerGender: Gender.WOMEN,
        channel: Channel.KBS,
        link: 'test link',
        thumbnail: 'test thumbnail',
        startTime: 3,
        endTime: 53,
        suitability: Suitability.HIGH,
        isEmbeddable: true,
        reportDate: new Date(),
      };
      const result = await newsService.createNews(createNewsDto);
      expect(result.title).toStrictEqual(createNewsDto.title);
    });
  });

  describe('updateNews() : ?????? ?????? ??????', () => {
    it('SUCCESS: ?????? ?????? ??????', async () => {
      const updateNewsDto: UpdateNewsDto = {
        title: 'test2 title',
        category: Category.SOCIETY,
        announcerGender: Gender.WOMEN,
        channel: Channel.KBS,
        link: 'test2 link',
        thumbnail: 'test2 thumbnail',
        startTime: 3,
        endTime: 53,
        suitability: Suitability.HIGH,
        isEmbeddable: true,
        reportDate: new Date(),
      };
      const result = await newsService.updateNews(mockNews.id, updateNewsDto);
      expect(result.title).toStrictEqual(updateNewsDto.title);
    });
  });
});
