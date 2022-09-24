import { Controller, Get, Header, HttpCode, Logger, Post, Query, Res, UseGuards } from '@nestjs/common';
import { message } from 'src/modules/response/response.message';
import { statusCode } from 'src/modules/response/response.status.code';
import { util } from 'src/modules/response/response.util';
import { JwtAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

require("dotenv").config();
const kakaoClientId = process.env.KAKAO_CLIENT_ID;
const kakaoCallbackURL = process.env.KAKAO_CALLBACK_URL;

const logger = new Logger('auth.controller');


@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		) {}

	/**
	 * 인가 코드 받아오는 로직 (프론트)
	 */
	@Get('/kakao')
	@Header('Content-Type', 'text/html')
	@HttpCode(200)
	kakaoLoginPage(): string {
		return `
		<div>
			<h1>카카오 로그인</h1>
	
			<form action="/auth/kakaoLoginLogic" method="GET">
			<input type="submit" value="카카오 로그인" />
			</form>
	
			<form action="/auth/kakaoLogout" method="GET">
			<input type="submit" value="카카오 로그아웃" />
			</form>
		`;
	}


	@Get('/kakaoLoginLogic')
	@Header('Content-Type', 'text/html')
	kakaoLoginGetCode(@Res() res): void {
		const _hostName = 'https://kauth.kakao.com';
		const _restApiKey = kakaoClientId;
		// 카카오 로그인 redirectURI 등록
		const _redirectUrl = kakaoCallbackURL;
		const url = `${_hostName}/oauth/authorize?client_id=${_restApiKey}&redirect_uri=${_redirectUrl}&response_type=code`;
		return res.redirect(url);
	}


	/**
	 * 새로 로직 작성 중
	 */

	// 사용자 정보 존재 확인(인가코드로)
	@Post('/authentication/kakao')
	@Header('Content-Type', 'application/json; charset=utf-8')
	async kakaoLoginGetUserIsByCode(@Query() qs, @Res() res): Promise<Response> {
		const code = qs.code;
		
		try {
			const jwt = await this.authService.kakaoAuthentication(code);
			res.setHeader('Authorization', 'Bearer ' + jwt['accessToken']);
			// return res.json(jwt);
			return res.status(statusCode.OK)
				.send(util.success(
					statusCode.OK,
					message.AUTHENTICATION_SUCCESS,
					jwt
				))

		} catch (error) {
			logger.error(error);
			// console.log('error', error);
			console.log("error response >>>>>>", error.response);
			if (error.response.statusCode === statusCode.UNAUTHORIZED) {
				return res.status(statusCode.UNAUTHORIZED)
					.send(util.fail(
						statusCode.UNAUTHORIZED,
						message.AUTHENTICATION_FAIL
					))
			}
			return res.status(statusCode.INTERNAL_SERVER_ERROR)
				.send(util.fail(
					statusCode.INTERNAL_SERVER_ERROR,
					message.INTERNAL_SERVER_ERROR
				))
		}
	}
	

	@Get('test')
	@UseGuards(JwtAuthGuard)
	authTest(@Res() res): void {
		return res.send('auth test work');
	}
}
