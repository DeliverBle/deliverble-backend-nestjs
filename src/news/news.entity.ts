import { ScriptDefault } from "src/dummy/entity/script-default.entity";
import { ScriptGuide } from "src/dummy/entity/script-guide.entity";
import { Time } from "src/modules/Time";
import { Script } from "src/script/entity/script.entity";
import { Tag } from "src/tag/tag.entity";
// import { Favorite } from "src/user/favorite.entity";
import { User } from "src/user/user.entity";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./common/category.enum";
import { Channel } from "./common/channel.enum";
import { Gender } from "./common/gender.enum";
import { Suitability } from "./common/suitability.enum";


@Entity()
export class News extends BaseEntity {
    constructor(
        _title: string,
        _category: Category,
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

    @ManyToMany(() => User, (user) => user.favorites)
    favorites: User[]

    @ManyToMany(() => Tag, (tag) => tag.forView, {
        eager: true,
    })
    @JoinTable()
    tagsForView: Tag[];

    @ManyToMany(() => Tag, (tag) => tag.forRecommend, {
        eager: true,
    })
    @JoinTable()
    tagsForRecommend: Tag[];

    @OneToMany(() => Script, (script) => script.news)
    scripts: Script[];

    @OneToOne(() => ScriptDefault, (scriptDefault) => scriptDefault.news)
    scriptDefault: Promise<ScriptDefault>;

    @OneToOne(() => ScriptDefault, (scriptGuide) => scriptGuide.news)
    scriptGuide: Promise<ScriptGuide>;
}
