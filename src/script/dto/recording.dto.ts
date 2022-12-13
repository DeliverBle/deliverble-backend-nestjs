import { Script } from '../entity/script.entity';

export class RecordingDto {
  name: string;
  link: string;
  endTime: number;
  isDeleted: boolean;
  date: string;
  script: Script;

  constructor(
    name: string,
    link: string,
    endTime: number,
    isDeleted: boolean,
    date: string,
    length: number,
  ) {
    this.name = this.determineName(name, length);
    this.link = link;
    this.endTime = endTime;
    this.isDeleted = isDeleted;
    this.date = date;
  }

  determineName(nameInput: string, length: number): string {
    if (!nameInput) {
      return '새로운 녹음 ' + length;
    }
    return nameInput;
  }
}
