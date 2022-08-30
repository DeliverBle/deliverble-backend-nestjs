import { HttpService, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosResponse } from 'axios';
import qs from 'qs';
import { lastValueFrom } from 'rxjs';
import { Gender } from 'src/news/common/Gender';
import { AuthRepository } from './auth.repository';
import { Payload } from './common/payload';
import { Social } from './common/Social';
import { User } from './user.entity';
require("dotenv").config();

const kakaoClientId = process.env.KAKAO_CLIENT_ID;
const kakaoCallbackURL = process.env.KAKAO_CALLBACK_URL;

const logger = new Logger('auth.service');



@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
		private readonly jwtService: JwtService,
  ) {};

	// 토큰 발급 받기
	async getTokenFromKakao(code: string): Promise<AxiosResponse> {
		const url = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${kakaoClientId}&redirect_uri=${kakaoCallbackURL}&code=${code}`;
		const header = {
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
		};
		try {
			const response = await axios({
				method: 'GET',
				url: url,
				timeout: 30000,
				headers: header,
			});
			return response;
		} catch (error) {
			logger.error(error);
			throw new UnauthorizedException();
		}
	}

	// 유저 정보 받아오기
	async getUserInfoFromKakao(access_token: string): Promise<AxiosResponse> {
		const url = 'https://kapi.kakao.com/v2/user/me';
		const headerUserInfo = {
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
			Authorization: 'Bearer ' + access_token,
		};
		try {
			const response = await axios({
				method: 'GET',
				url: url,
				timeout: 30000,
				headers: headerUserInfo,
			});
			return response;
		} catch (error) {
			logger.error(error);
			throw new UnauthorizedException();
		}
	}

	// 인가 코드 -> 토큰 -> 유저 정보
  async getTokenAndUserInfoFromKakao(code: string): Promise<AxiosResponse> {
    const responseGetToken = await this.getTokenFromKakao(code);
    logger.debug('responseGetToken >>>>', responseGetToken.data);
    const access_token = responseGetToken.data.access_token;
    return await this.getUserInfoFromKakao(access_token);
  }

	// socialId -> 유저 존재 여부
  async checkUserIs(socialId: string): Promise<User> {
    return await this.authRepository.findUserBySocialId(socialId);
  }

	async signUpWithKakao(kakaoUserInfo: Object): Promise<any> {		
		const kakaoId: string = kakaoUserInfo['id'];
		const nickname: string = kakaoUserInfo['kakao_account'].profile.nickname;
		var email: string | undefined = kakaoUserInfo['kakao_account'].email;
		var genderRaw: string | undefined = kakaoUserInfo['kakao_account'].gender;
		var gender: Gender;

		if (email === undefined) {
			email = 'NO_EMAIL';
		}
		
		// TODO : entity method로 수정 필요
		if (genderRaw === undefined) {
			gender = Gender.UNSPECIFIED;
		} else if (genderRaw === 'male') {
			gender = Gender.MEN
		} else {
			gender = Gender.WOMEN
		}

		const user = new User(kakaoId, nickname, email, gender, Social.KAKAO);
		return this.authRepository.createUser(user);

	}
  
	// 인가 코드 -> 토큰 -> 유저 정보 -> 유저 존재 여부 확인 -> 가입
	async kakaoLoginOrSignUp(code: string): Promise<User | { accessToken: string }> {
		// 토큰 받아오기
		const responseGetToken = await this.getTokenFromKakao(code);
    const access_token = responseGetToken.data.access_token;
		
		// 유저 정보 받아오기
		const responseGetUserInfo = await this.getUserInfoFromKakao(access_token)
		const kakaoUserInfo = responseGetUserInfo.data;
		logger.debug('kakao user data >>>>', kakaoUserInfo);
		console.log(typeof kakaoUserInfo);
		console.log(kakaoUserInfo.kakao_account.profile.nickname);
		console.log(kakaoUserInfo.kakao_account.profile.nickname2);
		
		// 등록된 ID가 있는지 확인해서 가져오기
		const socialId = kakaoUserInfo.id;
		const registeredUser = await this.checkUserIs(socialId);
		
		// JWT 발급 테스트
		return this.signIn(registeredUser);

		// 등록된 ID가 없다면 가입하기
		if (registeredUser === undefined) {
			logger.debug('signup >>>>')
			return this.signUpWithKakao(kakaoUserInfo);
		}

		// 등록된 ID가 있다면 return하기
		logger.debug('registered user >>>>', registeredUser);
		return registeredUser;

	}

	async signIn(userInfo: User): Promise<{ accessToken: string }> {
		const id = User['id'];
		const socialId = User['socialId'];
		const email = User['email'];
		const gender = User['gender'];
		const social = User['social'];

    const user = await this.authRepository.findOne({ socialId });
    // if (user && (await bcrypt.compare(password, user.password))) {
		// 유저토큰 생성(Secret + Paylozd)
		const payload: Payload = { id, socialId, email, gender, social }; //패이로드에 중요한 정보는 넣으면 안된다.
		const accessToken = await this.jwtService.sign(payload); //여기서 알아서 payload를합쳐서 만들어준다.
		return { accessToken };
  }




//     async kakaoLogin(code: string): Promise<any> {
//         // const kakaoKey = '87073966cb41...';
//         const kakaoTokenUrl = 'https://kauth.kakao.com/oauth/token';
//         const kakaoUserInfoUrl = 'https://kapi.kakao.com/v2/user/me';
//         logger.debug('code >>>>', code);
//         const body = {
//           grant_type: 'authorization_code',
//           client_id: kakaoClientId,
//           redirect_uri: kakaoCallbackURL,
//           code: code,
//         };
//         logger.debug('body >>>>', body);
//         const bodyStringify = JSON.stringify(body);
//         logger.debug('JSON.stringify >>>>', bodyStringify);
//         const headers = {
//           'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
//         };
//         try {
//           const url = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${kakaoClientId}&redirect_uri=${kakaoCallbackURL}&code=${code}`
//           logger.debug('url >>>>', url);
//           const response = await lastValueFrom(
//             this.http.post(url, '', { headers })
//           );
//           logger.debug('response >>>>', response);
//           // const response = await axios({
//           //   method: 'POST',
//           //   url: url,
//           //   timeout: 30000,
//           //   headers,
//           //   // data: JSON.stringify(body),
//           // });
//         //   return await lastValueFrom(
//         //     this.http.post(url, '', { headers })
//         // );
//           if (response.status === 200) {
//             console.log(`kakaoToken : ${JSON.stringify(response.data)}`);
//             // Token 을 가져왔을 경우 사용자 정보 조회
//             const headerUserInfo = {
//               'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
//               Authorization: 'Bearer ' + response.data.access_token,
//             };
//             console.log(`url : ${kakaoTokenUrl}`);
//             console.log(`headers : ${JSON.stringify(headerUserInfo)}`);
//             const responseUserInfo = await axios({
//               method: 'GET',
//               url: kakaoUserInfoUrl,
//               timeout: 30000,
//               headers: headerUserInfo,
//             });
//             console.log(`responseUserInfo.status : ${responseUserInfo.status}`);
//             if (responseUserInfo.status === 200) {
//               console.log(
//                 `kakaoUserInfo : ${JSON.stringify(responseUserInfo.data)}`,
//               );
//               return responseUserInfo.data;
//             } else {
//               throw new UnauthorizedException();
//             }
//           } else {
//             throw new UnauthorizedException();
//           }
//         } catch (error) {
//           console.log(error);
//           throw new UnauthorizedException();
//         }
//     }
//     check: boolean;
//     accessToken: string;
//     private http: HttpService;
//     constructor() {
//         this.check = false;
//         this.http = new HttpService();
//         this.accessToken = '';
//     }
//     loginCheck(): void {
//         this.check = !this.check;
//         return ;
//     }
//     async login(url: string, headers: any): Promise<any> {
//         return await lastValueFrom(
//             this.http.post(url, '', { headers })
//         );
//     }
//     setToken(token: string): boolean {
//         this.accessToken = token;
//         return true;
//     }    

//     async showUserInfo(url: string, headers: any): Promise<any> {
//         // console.log(`헤더: ${JSON.stringify(headers.headers)}`)
//         return await lastValueFrom(
//             this.http.get(url, { headers })
//         );
//     }
}
