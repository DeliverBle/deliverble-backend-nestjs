import { Injectable, Logger } from '@nestjs/common';
import { UserForViewDto } from './dto/user-for-view.dto';
import { ReturnUserDto } from './dto/return-user.dto';

const logger = new Logger('user.service');

@Injectable()
export class UserService {
  async getUserInfo(userInfo: ReturnUserDto): Promise<UserForViewDto> {
    const userInfoForView = new UserForViewDto(
      userInfo.nickname,
      userInfo.email
      );
    return userInfoForView;
  }
}
