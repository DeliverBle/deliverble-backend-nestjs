import { ReturnTagDto } from './return-tag.dto';

export class ReturnTagDtoCollection {
  constructor(returnTagDtoList: ReturnTagDto[]) {
    this.returnTagDtoCollection = returnTagDtoList;
  }

  returnTagDtoCollection: ReturnTagDto[] | [];
}
