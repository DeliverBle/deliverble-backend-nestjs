import { EntityRepository, Repository } from 'typeorm';
import { Recording } from '../entity/recording.entity';
import { RecordingDto } from '../dto/recording.dto';
// import { ReturnRecordingDto } from "../dto/return-recording.dto";

@EntityRepository(Recording)
export class RecordingRepository extends Repository<Recording> {
  async createRecording(recordingDto: RecordingDto): Promise<Recording> {
    const recording: Recording = new Recording();
    recording.name = recordingDto.name;
    recording.link = recordingDto.link;
    recording.endTime = recordingDto.endTime;
    recording.isDeleted = recordingDto.isDeleted;
    recording.date = recordingDto.date;
    recording.script = recordingDto.script;

    await recording.save();

    console.log(
      '>>>>>>> LINK >>>>>>>>>>>>> ',
      await this.getRecordingByLink(recording.link),
    );
    return recording;
  }

  // find by recording using link
  async getRecordingByLink(link: string): Promise<Recording> {
    return await this.createQueryBuilder('recording')
      .where('recording.link = :link', { link: link })
      .getOneOrFail();
  }
}
