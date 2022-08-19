import { IsEmail, Length } from "class-validator";
import { Gender } from "src/news/common/Gender";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends BaseEntity {
    constructor(
        _title: string,
        ) {
        super();
        this.socialId = _title;
        }
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    socialId: string

    @Column()
    nickname: string;
  
    @IsEmail()
    @Column({
      unique: true,
      default: "NO_EMAIL"
    })
    email: string;
  
    @Column({
      type: 'enum',
      enum: Gender,
      default: Gender.UNSPECIFIED,
    })
    gender: Gender;
}
