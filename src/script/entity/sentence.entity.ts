import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Script } from "./script.entity";

@Entity()
export class Sentence extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Script, (script) => script.sentences, {
    onDelete: 'CASCADE',
  })
  script: Script;

  @Column()
  order: number;

  @Column({ type: "float" })
  startTime: number;

  @Column({ type: "float" })
  endTime: number;
  
  @Column({ type: 'varchar', length: 255 })
  text: string;
}
