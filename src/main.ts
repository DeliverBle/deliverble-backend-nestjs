import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const KakaoStrategy = require('passport-kakao').Strategy;
const passport = require('passport')
const kakaoClientId = process.env.KAKAO_CLIENT_ID;
const kakaoCallbackURL = process.env.KAKAO_CALLBACK_URL;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

passport.use('kakao', new KakaoStrategy({
  clientID: kakaoClientId,
  callbackURL: kakaoCallbackURL,     // 위에서 설정한 Redirect URI
}, async (accessToken, refreshToken, profile, done) => {
  //console.log(profile);
  console.log(accessToken);
  console.log(refreshToken);
}))
