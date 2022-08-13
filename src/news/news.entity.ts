import { Time } from "src/module/Time";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./common/Category";
import { Channel } from "./common/Channel";
import { Gender } from "./common/Gender";
import { Suitability } from "./common/Suitability";


@Entity()
export class News extends BaseEntity {
    constructor(
        _title: string,
        _category: Category,
        _script: string,
        _announcerGender: Gender,
        _channel: Channel,
        _link: string,
        _thumbnail: string,
        _startTime: number,
        _endTime: number,
        _suitability: Suitability,
        _isEmbeddable: boolean,
        _reportDate: Date,
        ) {
        super();
        this.title = _title;
        this.category = _category;
        this.script = _script;
        this.announcerGender = _announcerGender;
        this.channel = _channel;
        this.link = _link;
        this.thumbnail = _thumbnail;
        this.startTime = _startTime;
        this.endTime = _endTime;
        this.suitability = _suitability;
        this.isEmbeddable = _isEmbeddable;
        this.reportDate = _reportDate;
        }
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    title: string;

    @Column({
    type: 'enum',
    name: 'category',
    enum: Category,
    default: Category.UNSPECIFIED,
    })
    category: Category;

    @Column({ type: 'varchar', length: 1000 })
    script: string;

    @Column({
    type: 'enum',
    name: 'announcer_gender',
    enum: Gender,
    default: Gender.UNSPECIFIED,
    })
    announcerGender: Gender;

    @Column({
    type: 'enum',
    name: 'channel',
    enum: Channel,
    default: Channel.UNSPECIFIED,
    })
    channel: Channel;

    @Column({ type: 'varchar', length: 1000 })
    link: string;

    @Column({ type: 'varchar', length: 1000 })
    thumbnail: string;

    @Column('float')
    startTime: number;

    @Column('float')
    endTime: number;

    @Column({
    type: 'enum',
    name: 'suitability',
    enum: Suitability,
    default: Suitability.MEDIUM,
    })
    suitability: Suitability;

    @Column('varchar')
    isEmbeddable: boolean;

    @Column('date')
    reportDate: Date;
}
