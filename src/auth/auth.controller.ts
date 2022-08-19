import { BadRequestException, Body, Controller, Get, Header, HttpCode, HttpService, HttpStatus, Logger, Post, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import passport from 'passport';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
require("dotenv").config();

const kakaoClientId = process.env.KAKAO_CLIENT_ID;
const kakaoCallbackURL = process.env.KAKAO_CALLBACK_URL;

const logger = new Logger('auth.controller');

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    private http: HttpService;

    @Get('/kakao')
    @Header('Content-Type', 'text/html')
    @HttpCode(200)
    // @UseGuards(AuthGuard('kakao'))
    kakaoLogin(): string {
        // passport.authenticate('kakao');
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
    kakaoLoginLogic(@Res() res): void {
        const _hostName = 'https://kauth.kakao.com';
        const _restApiKey = kakaoClientId;
        // 카카오 로그인 redirectURI 등록
        const _redirectUrl = kakaoCallbackURL;
        const url = `${_hostName}/oauth/authorize?client_id=${_restApiKey}&redirect_uri=${_redirectUrl}&response_type=code`;
        return res.redirect(url);
    }
    @Get('/kakaoLoginLogicRedirect')
    @Header('Content-Type', 'text/html')
    kakaoLoginLogicRedirect(@Query() qs, @Res() res):void {
        console.log('query string' + qs.code);  
    
        const _restApiKey = kakaoClientId;
        const _redirect_uri = process.env.KAKAO_CALLBACK_URL;
        const _hostName = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${_restApiKey}&redirect_uri=${_redirect_uri}&code=${qs.code}`;
            const _headers = {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
        };
            //POST 요청을 위한 kakaoService
        this.authService
            .login(_hostName, _headers)
            .then((e) => {
            // console.log(e);
            console.log(`TOKEN : ${e.data['access_token']}`);
            this.authService.setToken(e.data['access_token']);
            this.kakaoUserInfo(e.data);
            return res.send(`
                <div>
                <h2>축하합니다!</h2>
                <p>카카오 로그인 성공하였습니다!</p>
                <a href="/auth/kakaoLogin">메인으로</a>
                </div>
            `);
            })
            .catch((err)=> {
            console.log(err);
            return res.send('error');
            });
    }

    @Get('/kakaoLogin')
    @Header('Content-Type', 'text/html')
    async kakaoUserInfo(@Res() res) {
            //GET요청을 보내기 위해 필요한 정보들
        const _url = "https://kapi.kakao.com/v2/user/me";
        // console.log(res);
        const _headers = {
        headers: {
            'Authorization': `Bearer ${res.access_token}`,
        },
        }
        // console.log(`토큰: ${res.access_token}`)
        this.authService
        .showUserInfo(_url, _headers.headers)
        .then((e)=> {
            console.log(e);
        })
        .catch((err)=> {
            console.log(err);
            return res.send('error');
        })
    }




    /**
     * 
     * 이하 passport 사용한 로직
     */

    @Get('/kakao/test')
    @HttpCode(200)
    @UseGuards(AuthGuard('kakao'))
    async kakaoLoginTest() {
        return HttpStatus.OK;
    }

    @Get('kakao/callback1')
    @HttpCode(200)
    @UseGuards(AuthGuard('kakao'))
    // async kakaoLoginCallback(@Query() qs, @Req() req: any): Promise<{ accessToken: string }> {
    async kakaoLoginCallback(@Query() qs, @Req() req: any): Promise<any> {
        logger.debug('query string >>>>', qs);
        logger.debug('query string code >>>>', qs.code);
        logger.debug('request >>>>', req);
        logger.debug('req.user >>>>', req.user);
        
        const _headers = {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          };
        const code = qs.code;
        const _hostName = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${kakaoClientId}&redirect_uri=${kakaoCallbackURL}&code=${code}`
        logger.debug('url >>>>', _hostName);

        // await this.authService.login(url, headers);
        // const response = await lastValueFrom(
        //   this.http.post(url, '', { headers })
        // );
        // logger.debug('response at controller', response);
        // return this.authService.kakaoLogin(qs.code);
        // return 0;
        this.authService
        .login(_hostName, _headers)
        .then((e) => {
        // console.log(e);
        console.log(`TOKEN : ${e.data['access_token']}`);
        this.authService.setToken(e.data['access_token']);
        this.kakaoUserInfo(e.data);
        return 0;
        })
        .catch((err)=> {
        console.log(err);
        return 0;
        });
    }

    @Post('/login')
    async login(@Body() body: any, @Res() res): Promise<any> {
        try {
        // 카카오 토큰 조회 후 계정 정보 가져오기
        const { code, domain } = body;
        if (!code || !domain) {
            throw new BadRequestException('카카오 정보가 없습니다.');
        }
        const kakao = await this.authService.kakaoLogin(code);

        console.log(`kakaoUserInfo : ${JSON.stringify(kakao)}`);
        if (!kakao.id) {
            throw new BadRequestException('카카오 정보가 없습니다.');
        }

        res.send({
            user: kakao,
            message: 'success',
        });
        } catch (e) {
        console.log(e);
        throw new UnauthorizedException();
        }
  }
}
