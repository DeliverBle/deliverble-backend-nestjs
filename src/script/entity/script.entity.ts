import { News } from "src/news/news.entity";
import { User } from "src/user/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Sentence } from "./sentence.entity";

@Entity()
export class Script extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ManyToOne(() => User, (user) => user.scripts)
  user: User;

  @ManyToOne(() => News, (news) => news.scripts)
  news: News;

  @OneToMany(() => Sentence, (sentence) => sentence.script, {
    eager: true,
  })
  sentences: Sentence[];

}
