import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { AuthGuard, PassportStrategy } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Payload } from "./dto/payload";


const logger: Logger = new Logger;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private authService: AuthService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: 'SECRET',
        })
    }

    async validate(payload: Payload, done: VerifiedCallback): Promise<any> {
        const user = await this.authService.tokenValidateUser(payload);
        if (!user) {
			logger.debug('auth test fail >>>>', user);
            return done(new UnauthorizedException({ message: 'user does not exist' }), false);
        }

        return done(null, user);
    }
}

