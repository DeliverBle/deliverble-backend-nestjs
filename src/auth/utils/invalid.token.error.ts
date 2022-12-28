import { Catch, HttpException } from "@nestjs/common";
import { message } from 'src/modules/response/response.message';
import { statusCode } from 'src/modules/response/response.status.code';

@Catch(HttpException)
export class InvalidTokenError extends HttpException {
  constructor() {
    super(message.INVALID_TOKEN, statusCode.UNAUTHORIZED);
  }
}
