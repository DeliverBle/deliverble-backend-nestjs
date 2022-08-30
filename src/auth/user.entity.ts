import { IsEmail, Length } from "class-validator";
import { Gender } from "src/news/common/Gender";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Social } from "./common/Social";

@Entity()
export class User extends BaseEntity {
    constructor(
        _socialId: string,
        _nickname: string,
        _email: string,
        _gender: Gender,
        _social: Social,
        ) {
        super();
        this.socialId = _socialId;
        this.nickname = _nickname;
        this.email = _email;
        this.gender = _gender;
        this.social = _social;
        }
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    socialId: string

    @Column({
      default: 'need fix'
    })
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

    @Column({
      type: 'enum',
      enum: Social,
      default: Social.ETC,
    })
    social: Social;
}
