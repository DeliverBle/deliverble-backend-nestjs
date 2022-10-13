import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DummyScript } from "./dummy-script.entity";

@Entity()
export class DummySentence extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DummyScript, (dummyScript) => dummyScript.dummySentences, {
    onDelete: 'CASCADE',
  })
  dummyScript: DummyScript;

  @Column()
  order: number;
  
  @Column({ type: 'varchar', length: 255 })
  text: string;
}
