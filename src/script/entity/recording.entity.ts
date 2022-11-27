import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Script } from "./script.entity";

@Entity()
export class Recording extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string; // 굳이 값 객체로 만들 필요는 없을 듯

  @Column({ type: 'varchar', length: 255 })
  link: string; // 추후 URI 값 객체로 만들기 리팩토링 (e.g. aws s3 링크가 아니면 error throw)

  @ManyToOne(() => Script, (script) => script.recordings, {
    onDelete: 'CASCADE',
  })
  script: Script;

  // seconds로 표기 23s -> 23 1 minute 57 seconds -> 117
  @Column({ type: 'int' })
  endTime: number;

  // isdeleted
  @Column({ type: 'boolean' })
  isDeleted: boolean;

  @Column({ type: 'varchar', length: 255 })
  date: string; // 추후 Date 값 객체로 만들기 리팩토링
}
