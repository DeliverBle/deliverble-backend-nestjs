import { Script } from "../entity/script.entity";

export class CreateMemoDto { 
  script: Script;
  order: number;
  content: string;
}
