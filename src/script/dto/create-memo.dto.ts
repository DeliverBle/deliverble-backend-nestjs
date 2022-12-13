import { Script } from '../entity/script.entity';

export class CreateMemoDto {
  userId: number;
  script: Script;
  order: number;
  startIndex: number;
  keyword: string;
  content: string;
}
