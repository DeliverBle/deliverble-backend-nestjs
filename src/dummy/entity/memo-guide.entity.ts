import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ScriptGuide } from './script-guide.entity';

@Entity()
export class MemoGuide extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ScriptGuide, (scriptGuide) => scriptGuide.memoGuides, {
    onDelete: 'CASCADE',
  })
  scriptGuide: ScriptGuide;

  @Column()
  order: number;

  @Column()
  startIndex: number;

  @Column({ type: 'varchar', length: 255 })
  content: string;
}
