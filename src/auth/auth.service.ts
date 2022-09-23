import { HttpService, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosResponse } from 'axios';
import qs from 'qs';
import { lastValueFrom } from 'rxjs';
import { Gender } from '../news/common/Gender';
import { AuthRepository } from './auth.repository';
import { Payload } from './dto/payload';
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


	// socialId -> 유저 존재 여부
  async checkUserIs(socialId: string): Promise<User> {
		return await this.authRepository.findOne({
			where: { socialId: socialId }
		});
  }


	async signUpWithKakao(kakaoUserInfo: Object): Promise<any> {		
		logger.debug(kakaoUserInfo);
		const kakaoId: string = kakaoUserInfo['id'].toString();
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
		
		// 등록된 ID 찾기
		const socialId = kakaoUserInfo.id;
		const registeredUser = await this.checkUserIs(socialId);
		console.log('user after checkUserId >>>>>>', registeredUser);
		
		// 등록된 ID가 없다면, 가입 후 해당 ID 로그인
		if (registeredUser === undefined) {
			const newUser = await this.signUpWithKakao(kakaoUserInfo);
			logger.debug('socialId after signUpWithKakao >>>>>>',
			typeof newUser.socialId,
			newUser.socialId
			)
			return this.signIn(newUser);
		}
		// 등록된 ID가 있다면, 해당 ID 로그인
		return this.signIn(registeredUser);

	}

	async signIn(userInfo: User): Promise<{ accessToken: string }> {
		logger.debug('user in signIn >>>>', userInfo);
		
		const id = userInfo['id'];
		const socialId = userInfo['socialId'];
		const nickname = userInfo['nickname'];
		const email = userInfo['email'];
		const gender = userInfo['gender'];
		const social = userInfo['social'];

		const payload: Payload = { 
			id: id,
			socialId: socialId,
			nickname: nickname,
			email: email,
			gender: gender,
			social: social
		};

		logger.debug('payload right before signIn >>>>', payload);
		const accessToken = await this.jwtService.sign(payload); //여기서 알아서 payload를합쳐서 만들어준다.
		return { accessToken };
  }

	async tokenValidateUser(payload: Payload): Promise<User | undefined> {
		logger.debug('tokenValidateUser in auth.service - payload', payload);
    return await this.authRepository.findOne({
			where: { id: payload.id }
	});
	}
}
