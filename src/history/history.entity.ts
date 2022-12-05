import { News } from "src/news/news.entity";
import { User } from "src/user/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class History extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.histories)
  user: User;

  @ManyToOne(() => News, (news) => news.histories)
  news: News;

  @Column()
  date: Date;
}
