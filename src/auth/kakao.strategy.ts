import { Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-kakao";
require("dotenv").config();

const kakaoClientId = process.env.KAKAO_CLIENT_ID;
const kakaoCallbackURL = process.env.KAKAO_CALLBACK_URL;
const logger = new Logger('kakao.strategy');

export class KakaoStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            clientID: kakaoClientId,
            callbackURL: kakaoCallbackURL,
        });
    }

    async validate(accessToken, refreshToken, profile, done) {
        const profileJson = profile._json;
        logger.debug(profileJson);
        const kakao_account = profileJson.kakao_account;
        logger.debug(kakao_account);
        const payload = {
            // name: kakao_account.profile.nickname,
            kakaoId: profileJson.id,
            email:
                kakao_account.has_email && !kakao_account.email_needs_agreement
                    ? kakao_account.email
                    : null,
        };
        done(null, payload);
    }
}
