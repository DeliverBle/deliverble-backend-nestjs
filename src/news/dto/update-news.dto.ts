import { Time } from "src/modules/Time";
import { Category } from "../common/Category";
import { Channel } from "../common/Channel";
import { Gender } from "../common/Gender";
import { Suitability } from "../common/Suitability";

export class UpdateNewsDto {
    title: string;
    category: Category;
    script: string;
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
