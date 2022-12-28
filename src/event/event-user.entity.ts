import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class EventUser extends BaseEntity {
  constructor(
    _nickname: string,
    _email: string,
  ) {
    super();
    this.nickname = _nickname;
    this.email = _email;
    this.date = new Date();
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 5 })
  nickname: string;

  @Column({ type: 'varchar', length: 200 })
  email: string;

  @Column({
    nullable: true,
  })
  date: Date;
}
