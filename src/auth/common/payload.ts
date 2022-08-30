import { Gender } from "src/news/common/Gender";
import { Social } from "./Social";

export interface Payload {
  id: number;
  socialId: string,
  email: string,
  gender: Gender,
  social: Social,
}
