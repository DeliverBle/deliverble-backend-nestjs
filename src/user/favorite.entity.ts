// import { News } from "src/news/news.entity";
// import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { User } from "./user.entity";

// @Entity()
// export class Favorite {
//   constructor(
//     _userId: number,
//     _newsId: number,
//     ) {
//     this.userId = _userId;
//     this.newsId = _newsId;
//     }
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   userId: number;

//   @Column()
//   newsId: number;

//   @ManyToOne(() => User, (user) => user.favorites)
//   @JoinColumn({ name: 'userId' })
//   user!: User;

//   @ManyToOne(() => News, (news) => news.favorites)
//   @JoinColumn({ name: 'newsId' })
//   news!: News;
// }
