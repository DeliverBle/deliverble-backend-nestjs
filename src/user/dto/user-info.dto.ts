import { Social } from "src/auth/common/Social";
import { Gender } from "src/news/common/Gender";

export class UserInfo {
  id: number;
  socialId: string;
  nickname: string;
  email: string;
  gender: Gender;
  social: Social;
}
