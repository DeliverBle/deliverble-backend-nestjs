import { News } from 'src/news/news.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MemoGuide } from './memo-guide.entity';
import { SentenceDefault } from './sentence-default.entity';
import { SentenceGuide } from './sentence-guide.entity';

@Entity()
export class ScriptGuide extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => News, (news) => news.scriptGuide, {
    eager: true,
  })
  @JoinColumn()
  news: News;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @OneToMany(() => SentenceGuide, (sentence) => sentence.scriptGuide, {
    eager: true,
  })
  sentenceGuides: SentenceGuide[];

  @OneToMany(() => MemoGuide, (memoGuide) => memoGuide.scriptGuide, {
    eager: true,
  })
  memoGuides: MemoGuide[];
}
