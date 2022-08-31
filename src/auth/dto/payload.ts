import { Gender } from "src/news/common/Gender";
import { Social } from "../common/Social";

export class Payload {
  id: number;
  socialId: string;
  nickname: string;
  email: string;
  gender: Gender;
  social: Social;
}
