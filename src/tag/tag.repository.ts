import { BadRequestException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { ReturnTagDto } from './dto/return-tag.dto';
import { Tag } from './tag.entity';

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {
  async createTag(createTagDto: CreateTagDto): Promise<Tag> {
    const { name, category } = createTagDto;

    const tag = new Tag(name, category);

    await this.save(tag);
    return tag;
  }

  async getTagByName(tagName: string): Promise<Tag> {
    const tag: Tag = await this.findOne({
      name: tagName,
    });
    if (tag === undefined) {
      throw new BadRequestException();
    }
    return tag;
  }

  async getTagsByNameList(tagList: string[]): Promise<Tag[]> {
    return await this.createQueryBuilder('tag')
      .where('tag.name IN (:...tagList)', { tagList })
      .getMany();
  }

  async deleteTag(tagName: string): Promise<ReturnTagDto> {
    const tag: Tag = await this.getTagByName(tagName);
    const returnTagDto: ReturnTagDto = new ReturnTagDto(tag);
    await this.delete({ name: tagName });
    return returnTagDto;
  }

  async getRecommendedTag(): Promise<Tag> {
    return this.findOne({
      name: '딜리버블 추천',
    });
  }

  async getSpeechGuideTag(): Promise<Tag> {
    return this.findOne({
      name: '스피치 가이드',
    });
  }
}
