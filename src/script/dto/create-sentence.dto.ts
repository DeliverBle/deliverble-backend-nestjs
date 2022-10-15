import { Script } from "../entity/script.entity";

export class CreateSentenceDto { 
  script: Script;
  order: number;
  startTime: number;
  endTime: number;
  text: string;
}
