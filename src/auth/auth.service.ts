import { HttpService, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosResponse } from 'axios';
import qs from 'qs';
import { lastValueFrom } from 'rxjs';
import { AuthRepository } from './auth.repository';
require("dotenv").config();

const kakaoClientId = process.env.KAKAO_CLIENT_ID;
const kakaoCallbackURL = process.env.KAKAO_CALLBACK_URL;

const logger = new Logger('auth.service');



@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
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
  async checkUserIs(socialId: string): Promise<boolean> {
    const user = await this.authRepository.findUserBySocialId(socialId);
    return user === undefined;
  }
  
	// 인가 코드 -> 토큰 -> 유저 정보 -> 유저 존재 여부 확인
	async kakaoLoginOrSignUp(code: string): Promise<boolean> {
		// 토큰 받아오기
		const responseGetToken = await this.getTokenFromKakao(code);
    const access_token = responseGetToken.data.access_token;
		
		// 유저 정보 받아오기
		const responseGetUserInfo = await this.getUserInfoFromKakao(access_token)
		const userInfo = responseGetUserInfo.data;
		
		// 등록된 ID가 있는지 확인
		const socialId = userInfo.id;
		return await this.checkUserIs(socialId);


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
