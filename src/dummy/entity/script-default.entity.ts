import { News } from "src/news/news.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DUMMY_SCRIPT_TYPE } from "../common/dummy-script-type.enum";
import { SentenceDefault } from "./sentence-default.entity";

@Entity()
export class ScriptDefault extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => News, (news) => news.scriptDefault, {
    eager: true,
  })
  @JoinColumn()
  news: News;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @OneToMany(() => SentenceDefault, (sentence) => sentence.scriptDefault, {
    eager: true,
  })
  sentenceDefaults: SentenceDefault[];

}
