export class UserForViewDto {
  constructor(_nickname: string, _email: string) {
    this.nickname = _nickname;
    this.email = _email;
  }

  nickname: string;
  email: string;
}
