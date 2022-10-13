import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ScriptDefault } from "./script-default.entity";

@Entity()
export class SentenceDefault extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ScriptDefault, (scriptDefault) => scriptDefault.sentenceDefaults, {
    onDelete: 'CASCADE',
  })
  scriptDefault: ScriptDefault;

  @Column()
  order: number;
  
  @Column({ type: 'varchar', length: 255 })
  text: string;
}
