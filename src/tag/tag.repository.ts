import { BadRequestException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { CreateTagDto } from "./dto/create-tag.dto";
import { ReturnTagDto } from "./dto/return-tag.dto";
import { Tag } from "./tag.entity";

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {
  async createTag(createTagDto: CreateTagDto): Promise<Tag> {
    const { 
      name, category
    } = createTagDto;
    

    const tag = new Tag(
      name, category
    );

    await this.save(tag);
    return tag;
}

async getTagByName(tagName: string): Promise<ReturnTagDto> {
  const tag: Tag = await this.findOne({
    name: tagName
  })
  if (tag === undefined) {
    throw new BadRequestException;
  }
  const returnTagDto: ReturnTagDto = new ReturnTagDto(tag);
  return returnTagDto;
}

async deleteTag(tagName: string): Promise<ReturnTagDto> {
  const tag: ReturnTagDto = await this.getTagByName(tagName);
  await this.delete(
      { name: tagName }
  )
  return tag;
}
}
