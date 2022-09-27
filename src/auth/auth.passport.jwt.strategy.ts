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
            // signOptions: { expiresIn: '10s' },
            secretOrKey: process.env.JWT_SECRET,
        })
    }

    async validate(payload: Payload, done: VerifiedCallback): Promise<any> {
        const user = await this.authService.tokenValidateUser(payload);
        console.log(user);
        if (!user) {
			logger.debug('auth test fail >>>>', user);
            return done(new UnauthorizedException({ message: 'user does not exist (in JwtStrategy)' }), false);
        }

        return done(null, user);
    }
}

