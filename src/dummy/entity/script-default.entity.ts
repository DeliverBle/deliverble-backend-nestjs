import { News } from "src/news/news.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SentenceDefault } from "./sentence-default.entity";
import { SentenceGuide } from "./sentence-guide.entity";

@Entity()
export class ScriptDefault extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => News, (news) => news.scriptGuide, {
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
