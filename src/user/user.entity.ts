import { IsEmail } from "class-validator";
import { Gender } from "../news/common/gender.enum";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Social } from "../auth/common/Social";
import { News } from "src/news/news.entity";
import { Script } from "src/script/entity/script.entity";
import { ScriptCount } from "src/script/entity/script-count.entity";

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

    @ManyToMany(() => News, (news) => news.favorites)
    @JoinTable()
    favorites: Promise<News[]>;

    @OneToMany(() => Script, (script) => script.user)
    scripts: Promise<Script[]>;

    @OneToMany(() => ScriptCount, (scriptCount) => scriptCount.user)
    scriptCounts: ScriptCount[];

  public updateExistingScript = async (updatedScript: Script) => {
    const nowScripts = await this.scripts;
    console.log('updateExistingScript ::: nowScripts ', nowScripts);
    const newScripts = nowScripts.map((script) => {
      if (script.id === updatedScript.id) {
        return updatedScript;
      }
      return script;
    });
    this.scripts = Promise.resolve(newScripts);
    return this;
  };
}
