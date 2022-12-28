import { ReturnEventUserDto } from "./return-event-user.dto";


export class ReturnEventUserDtoCollection {
  constructor(returnEventUserList: ReturnEventUserDto[]) {
    this.returnEventUserDtoCollection = returnEventUserList;
  }

  returnEventUserDtoCollection: ReturnEventUserDto[] | [];
}
