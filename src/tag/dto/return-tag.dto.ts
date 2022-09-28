import { Category } from "src/news/common/category.enum";
import { Tag } from "../tag.entity";

export class ReturnTagDto {
  constructor(tag: Tag) {
    this.id = tag.id;
    this.name = tag.name;
    this.category = tag.category;
  }
  id: number;
  name: string;
  category: Category;
}
