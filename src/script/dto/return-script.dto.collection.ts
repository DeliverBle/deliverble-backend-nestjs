import { ReturnScriptDto } from "./return-script.dto";

export class ReturnScriptDtoCollection {
  constructor(returnScriptDtoList: ReturnScriptDto[]) {
    this.returnScriptDtoCollection = returnScriptDtoList;
  }

  returnScriptDtoCollection: ReturnScriptDto[] | [];
}
