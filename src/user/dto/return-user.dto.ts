import { Social } from "src/auth/common/Social";
import { Gender } from "src/news/common/gender.enum";

export class ReturnUserDto {
  id: number;
  socialId: string;
  nickname: string;
  email: string;
  gender: Gender;
  social: Social;
}
