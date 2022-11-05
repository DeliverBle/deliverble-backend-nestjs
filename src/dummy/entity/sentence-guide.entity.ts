import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ScriptDefault } from "./script-default.entity";
import { ScriptGuide } from "./script-guide.entity";

@Entity()
export class SentenceGuide extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ScriptGuide, (scriptGuide) => scriptGuide.sentenceGuides, {
    onDelete: 'CASCADE',
  })
  scriptGuide: ScriptGuide;

  @Column()
  order: number;

  @Column({ type: "float" })
  startTime: number;

  @Column({ type: "float" })
  endTime: number;
  
  @Column({ type: 'varchar', length: 255 })
  text: string;
}
