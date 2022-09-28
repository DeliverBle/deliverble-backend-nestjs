import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../news/common/category.enum";

@Entity()
export class Tag extends BaseEntity {
  constructor(
      _name: string,
      _category: Category,
      ) {
      super();
      this.name = _name;
      this.category = _category;
      }
      
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({
  type: 'enum',
  name: 'category',
  enum: Category,
  default: Category.UNSPECIFIED,
  })
  category: Category;

}
