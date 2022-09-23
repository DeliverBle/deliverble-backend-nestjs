import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Gender } from 'src/news/common/Gender';
import { Repository } from 'typeorm';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { Social } from './common/Social';
import { Payload } from './dto/payload';
import { User } from './user.entity';

const mockUser: User = new User(
    "222222223",
    "test",
    "test@test.test",
    Gender.MEN,
    Social.KAKAO,
)
mockUser.id = 1;

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
      Social.KAKAO,
    );
    return user;
  },

  async createUser(user: User) {
    return user
  },
})

type MockAuthRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'SECRET',
          signOptions: { expiresIn: '300s' },
        }),
      ],
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
    jwtService = module.get<JwtService>(JwtService);
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

  describe("signUpWithKakao() : 회원가입", () => {
    it("SUCCESS: 회원가입 성공", async () => {
      // 카카오에서 넘어오는 유저 데이터 형식
      const kakaoUserInfo: Object = {
          "id": 222222223,
          "connected_at": "2022-08-30T04:52:39Z",
          "properties": {
            "nickname": "테스트"
          },
          "kakao_account": {
            "profile_nickname_needs_agreement": false,
            "profile": {
              "nickname": "테스트"
            },
            "has_email": true,
            "email_needs_agreement": false,
            "is_email_valid": true,
            "is_email_verified": true,
            "email": "test@test.test",
            "has_gender": true,
            "gender_needs_agreement": false,
            "gender": "male"
        }
      }
      const result = await authService.signUpWithKakao(kakaoUserInfo);
      expect(result.socialId).toEqual("222222223")
    })
  })

  describe("signIn() : 로그인", () => {
    it("SUCCESS: 로그인 성공", async () => {

      const id = mockUser['id'];
      const socialId = mockUser['socialId'];
      const nickname = mockUser['nickname'];
      const email = mockUser['email'];
      const gender = mockUser['gender'];
      const social = mockUser['social'];
  
      const payload: Payload = { 
        id: id,
        socialId: socialId,
        nickname: nickname,
        email: email,
        gender: gender,
        social: social
      };
  
      const accessToken = await jwtService.sign(payload); //여기서 알아서 payload를합쳐서 만들어준다.
      expect(typeof accessToken).toEqual("string");
    })
  })
});
