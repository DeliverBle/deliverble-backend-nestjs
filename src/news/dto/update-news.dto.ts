import { Time } from 'src/modules/Time';
import { Category } from '../common/category.enum';
import { Channel } from '../common/channel.enum';
import { Gender } from '../common/gender.enum';
import { Suitability } from '../common/suitability.enum';

export class UpdateNewsDto {
  title: string;
  category: Category;
  announcerGender: Gender;
  channel: Channel;
  link: string;
  thumbnail: string;
  startTime: number;
  endTime: number;
  suitability: Suitability;
  isEmbeddable: boolean;
  reportDate: Date;
}
