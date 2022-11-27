import { Recording } from "../entity/recording.entity";

export class ReturnRecordingDto {
  constructor(recording: Recording) {
    this.name = recording.name;
    this.link = recording.link;
    this.endTime = recording.endTime;
    this.isDeleted = recording.isDeleted;
    this.date = recording.date;
  }
  name: string;
  link: string;
  endTime: number;
  isDeleted: boolean;
  date: string;
}
