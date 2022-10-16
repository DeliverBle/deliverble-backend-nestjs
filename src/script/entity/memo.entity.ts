import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Script } from "./script.entity";

@Entity()
export class Memo extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Script, (script) => script.memos, {
    onDelete: 'CASCADE',
  })
  script: Script;

  @Column()
  order: number;

  @Column()
  startIndex: number;

  @Column({ type: 'varchar', length: 255 })
  content: string;
}
