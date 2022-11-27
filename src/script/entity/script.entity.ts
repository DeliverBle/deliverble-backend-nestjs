import { News } from "src/news/news.entity";
import { User } from "src/user/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Memo } from "./memo.entity";
import { Sentence } from "./sentence.entity";
import { Recording } from "./recording.entity";

@Entity()
export class Script extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ManyToOne(() => User, (user) => user.scripts, {
    eager: true,
  })
  user: User;

  @ManyToOne(() => News, (news) => news.scripts, {
    eager: true,
  })
  news: News;

  @OneToMany(() => Sentence, (sentence) => sentence.script, {
    eager: true,
  })
  sentences: Sentence[];

  @OneToMany(() => Memo, (memo) => memo.script, {
    eager: true,
  })
  memos: Memo[];

  @OneToMany(() => Memo, (memo) => memo.script, {
    eager: true,
  })
  recordings: Promise<Recording[]>;

  public addNewRecording = async (newRecording: Recording) => {
    let nowRecordings = await this.recordings;
    console.log('now Recordings this recordings : ', nowRecordings);
    if (nowRecordings === undefined) {
      nowRecordings = [];
    }
    nowRecordings.push(newRecording);
    console.log('newRecordings after push , newRecording');
    this.recordings = Promise.resolve(nowRecordings);

    return this.recordings;
  };
}
