import { ReturnScriptDto } from '../dto/return-script.dto';
import { Script } from '../entity/script.entity';

export const changeScriptsToReturn = (scripts: Script[]): ReturnScriptDto[] => {
  const returnScriptDtoList: ReturnScriptDto[] = scripts.map(
    (script) => new ReturnScriptDto(script),
  );
  return returnScriptDtoList;
};
