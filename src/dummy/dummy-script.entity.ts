import { News } from "src/news/news.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DUMMY_SCRIPT_TYPE } from "./common/dummy-script-type.enum";

@Entity()
export class DummyScript extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: DUMMY_SCRIPT_TYPE;

  @Column({ type: 'varchar', length: 255 })
  name: string;
  
  @ManyToOne(() => News, (news) => news.dummyScripts)
  news: News;

  @OneToMany(() => DummySentence, (sentence) => sentence.script, {
    eager: true,
  })
  dummySentences: DummySentence[];

}
