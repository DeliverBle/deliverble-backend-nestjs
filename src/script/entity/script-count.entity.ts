import { User } from "src/user/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ScriptCount extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.scriptCounts, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column()
  newsId: number;

  @Column()
  count: number;

}
