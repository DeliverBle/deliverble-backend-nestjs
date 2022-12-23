import { EventUser } from "../event-user.entity";

export class ReturnEventUserDto {
  constructor(eventUser: EventUser) {
    this.id = eventUser.id;
    this.nickname = eventUser.nickname;
    this.email = eventUser.email;
  }
  id: number;
  nickname: string;
  email: string;
}
