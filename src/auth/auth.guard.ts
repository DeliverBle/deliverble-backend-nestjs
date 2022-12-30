import { ExecutionContext, Injectable, Logger, Res, UnauthorizedException, UseFilters } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InvalidTokenError } from './utils/invalid.token.error';

const logger: Logger = new Logger();

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new InvalidTokenError();
    }
    return user;
  }
}
