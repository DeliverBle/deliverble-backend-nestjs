import { HttpService, Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import qs from 'qs';
import { lastValueFrom } from 'rxjs';
require("dotenv").config();

const kakaoClientId = process.env.KAKAO_CLIENT_ID;
const kakaoCallbackURL = process.env.KAKAO_CALLBACK_URL;

@Injectable()
export class AuthService {

    async kakaoLogin(options: { code: string; domain: string }): Promise<any> {
        const { code, domain } = options;
        // const kakaoKey = '87073966cb41...';
        const kakaoTokenUrl = 'https://kauth.kakao.com/oauth/token';
        const kakaoUserInfoUrl = 'https://kapi.kakao.com/v2/user/me';
        const body = {
          grant_type: 'authorization_code',
          client_id: kakaoClientId,
          redirect_uri: kakaoCallbackURL,
          code,
        };
        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        };
        try {
          const response = await axios({
            method: 'POST',
            url: kakaoTokenUrl,
            timeout: 30000,
            headers,
            data: qs.stringify(body),
          });
          if (response.status === 200) {
            console.log(`kakaoToken : ${JSON.stringify(response.data)}`);
            // Token 을 가져왔을 경우 사용자 정보 조회
            const headerUserInfo = {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
              Authorization: 'Bearer ' + response.data.access_token,
            };
            console.log(`url : ${kakaoTokenUrl}`);
            console.log(`headers : ${JSON.stringify(headerUserInfo)}`);
            const responseUserInfo = await axios({
              method: 'GET',
              url: kakaoUserInfoUrl,
              timeout: 30000,
              headers: headerUserInfo,
            });
            console.log(`responseUserInfo.status : ${responseUserInfo.status}`);
            if (responseUserInfo.status === 200) {
              console.log(
                `kakaoUserInfo : ${JSON.stringify(responseUserInfo.data)}`,
              );
              return responseUserInfo.data;
            } else {
              throw new UnauthorizedException();
            }
          } else {
            throw new UnauthorizedException();
          }
        } catch (error) {
          console.log(error);
          throw new UnauthorizedException();
        }
    }
    check: boolean;
    accessToken: string;
    private http: HttpService;
    constructor() {
        this.check = false;
        this.http = new HttpService();
        this.accessToken = '';
    }
    loginCheck(): void {
        this.check = !this.check;
        return ;
    }
    async login(url: string, headers: any): Promise<any> {
        return await lastValueFrom(
            this.http.post(url, '', { headers })
        );
    }
    setToken(token: string): boolean {
        this.accessToken = token;
        return true;
    }    

    async showUserInfo(url: string, headers: any): Promise<any> {
        // console.log(`헤더: ${JSON.stringify(headers.headers)}`)
        return await lastValueFrom(
            this.http.get(url, { headers })
        );
    }
}
