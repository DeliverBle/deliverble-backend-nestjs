import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Gender } from 'src/news/common/Gender';
import { Repository } from 'typeorm';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { Social } from './common/Social';
import { User } from './user.entity';

const MockAuthRepository = () => ({
  async findOne(socialIdCondition) {
    const socialId: string = socialIdCondition.where.socialId;
    if (socialId === "222222222") {
      return undefined;
    }
    const user: User = new User(
      socialId,
      "테스트",
      "test@test.test",
      Gender.MEN,
      Social.KAKAO,);
      return user;
  }
})

type MockAuthRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        { 
          provide: getRepositoryToken(AuthRepository),
          useValue: MockAuthRepository(),
        }
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it("should be 4", () => {
    expect(2+2).toEqual(4);
  })

  describe("checkUserIs() : Kakao id로 DB로부터 유저 존재 여부 판별", () => {
    // 존재하는 경우 : socialId = "222222223"
    // 존재하지 않는 경우 : socialId = "222222222"
    it("SUCCESS: 존재하는 경우 - User 객체 반환", async () => {
      const socialId: string = "222222223";
      const result = await authService.checkUserIs(socialId);
      expect(result.socialId).toEqual(socialId)
    })

    it("SUCCESS: 존재하지 않는 경우 - undefined 객체 반환", async () => {
      const socialId: string = "222222222";
      const result = await authService.checkUserIs(socialId);
      expect(result).toEqual(undefined)
    })
  })
});
