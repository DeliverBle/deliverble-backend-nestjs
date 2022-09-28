import { Category } from "src/news/common/category.enum";

export class CreateTagDto {
  name: string;
  category: Category;
}
