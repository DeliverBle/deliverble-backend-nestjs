import { EntityRepository, Repository } from "typeorm";
import { Recording } from "../entity/recording.entity";
import { RecordingDto } from "../dto/recording.dto";
import { ReturnRecordingDto } from "../dto/return-recording.dto";

@EntityRepository(Recording)
export class RecordingRepository extends Repository<Recording> {
  async createRecording(
    recordingDto: RecordingDto,
  ): Promise<ReturnRecordingDto> {
    const recording: Recording = new Recording();
    recording.name = recordingDto.name;
    recording.link = recordingDto.link;
    recording.endTime = recordingDto.endTime;
    recording.isDeleted = recordingDto.isDeleted;
    recording.date = recordingDto.date;
    recording.script = recordingDto.script;

    await recording.save();
    return recording;
  }
}
