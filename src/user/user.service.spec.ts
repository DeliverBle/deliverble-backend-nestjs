import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Social } from 'src/auth/common/Social';
import { Category } from 'src/news/common/Category';
import { Channel } from 'src/news/common/Channel';
import { Gender } from 'src/news/common/Gender';
import { Suitability } from 'src/news/common/Suitability';
import { News } from 'src/news/news.entity';
import { NewsRepository } from 'src/news/news.repository';
import { ReturnUserDto } from './dto/return-user.dto';
import { UserForViewDto } from './dto/user-for-view.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

const mockNews1: News = new News(
  "test title",
  Category.SOCIETY,
  "test script",
  Gender.WOMEN,
  Channel.KBS,
  "test link",
  "test thumbnail",
  3,
  53,
  Suitability.HIGH,
  true,
  new Date(),
)
mockNews1.id = 1;

const mockNews2: News = new News(
  "test title",
  Category.SOCIETY,
  "test script",
  Gender.WOMEN,
  Channel.KBS,
  "test link",
  "test thumbnail",
  3,
  53,
  Suitability.HIGH,
  true,
  new Date(),
)
mockNews2.id = 2;

const mockUser: User = new User(
  "222222223",
  "test",
  "test@test.test",
  Gender.MEN,
  Social.KAKAO,
)
mockUser.id = 1;
mockUser.favorites = Promise.resolve([mockNews1]);

const MockUserRepository = () => ({
  async addFavoriteNews(user: User, news: News) {
    mockUser.favorites = Promise.resolve([mockNews1, mockNews2]);
    return mockUser;
  },

  async deleteFavoriteNews(user: User, news: News) {
    mockUser.favorites = Promise.resolve([]);
    return mockUser;
  }
})

const MockNewsRepository = () => ({
  async findOne() {
    return mockNews1;
  }
})

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserRepository),
          useValue: MockUserRepository(),
        },
        {
          provide: getRepositoryToken(NewsRepository),
          useValue: MockNewsRepository(),
        }
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe("getUserInfo() : 로그인한 유저 정보 조회(내정보 화면 표시용)", () => {
    it("SUCCESS: 로그인한 유저 정보 조회 성공", async () => {
      const userInfo: ReturnUserDto = mockUser;
      const resultUser: UserForViewDto = await userService.getUserInfo(userInfo);
      expect(Object.keys(resultUser).length).toEqual(2);
    })
  })

  describe("toggleFavoriteNews() : 좋아하는 뉴스 등록 or 취소", () => {
    it("SUCCESS: 좋아하는 뉴스 등록", async () => {
      const user: User = mockUser;
      const newsId: number = mockNews2.id;
      
      await userService.toggleFavoriteNews(user, newsId);
      const resultFavorites = await mockUser.favorites;
      const compareFavorites = [mockNews1, mockNews2];
      expect(resultFavorites).toStrictEqual(compareFavorites);
    });

    it("SUCCESS: 좋아하는 뉴스 취소", async () => {
      const user: User = mockUser;
      const newsId: number = mockNews1.id;
      
      await userService.toggleFavoriteNews(user, newsId);
      const resultFavorites = await mockUser.favorites;
      const compareFavorites = [];
      expect(resultFavorites).toStrictEqual(compareFavorites);
    });
  })
});
