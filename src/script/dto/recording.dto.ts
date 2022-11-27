import { Script } from "../entity/script.entity";

export class RecordingDto {
  name: string;
  link: string;
  endTime: number;
  isDeleted: boolean;
  date: string;
  script: Script;
}
