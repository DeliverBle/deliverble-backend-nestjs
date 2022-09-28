import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { ReturnTagDtoCollection } from './dto/return-tag-collection.dto';
import { ReturnTagDto } from './dto/return-tag.dto';
import { Tag } from './tag.entity';
import { TagRepository } from './tag.repository';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagRepository)
    private tagRepository: TagRepository,
  ) {}
    
    async createTag(createTagDto: CreateTagDto): Promise<ReturnTagDto> {
      const tag: Tag = await this.tagRepository.createTag(createTagDto);
      const returnTagDto: ReturnTagDto = new ReturnTagDto(tag)
      return returnTagDto;
    };

    async getAllTags(): Promise<ReturnTagDtoCollection> {
      const tagList: Tag[] = await this.tagRepository.find();
      const returnTagDtoCollection: ReturnTagDtoCollection = new ReturnTagDtoCollection(tagList);
      return returnTagDtoCollection;
    }

    async deleteTag(tagName: string): Promise<ReturnTagDto> {
      const returnNewsDto: ReturnTagDto = await this.tagRepository.deleteTag(tagName);
      return returnNewsDto;
    }
}
