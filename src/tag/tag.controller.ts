import { Body, Controller, Delete, Get, Logger, Param, Post, Req, Res } from '@nestjs/common';
import { message } from 'src/modules/response/response.message';
import { statusCode } from 'src/modules/response/response.status.code';
import { util } from 'src/modules/response/response.util';
import { CreateTagDto } from './dto/create-tag.dto';
import { ReturnTagDtoCollection } from './dto/return-tag-collection.dto';
import { ReturnTagDto } from './dto/return-tag.dto';
import { Tag } from './tag.entity';
import { TagService } from './tag.service';

const logger: Logger = new Logger('tag controller');

@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) {};

  @Post('create')
	async createTag(
    @Body() createTagDto: CreateTagDto,
    @Res() res
    ): Promise<Response> {            
    try {
      const data: ReturnTagDto = await this.tagService.createTag(createTagDto);
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.CREATE_TAG_SUCCESS, data))
    
      } catch (error) {
      logger.error(error)
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR))
    }
  }

  @Get('get/all')
  async getAllTags(
    @Res() res
  ): Promise<Response> {
    try {
      const data: ReturnTagDtoCollection = await this.tagService.getAllTags();
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.READ_ALL_TAGS_SUCCESS, data))
    
      } catch (error) {
      logger.error(error)
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR))
    }
  }

  @Delete('delete/:tagName')
  async deleteTag(
    @Req() req,
    @Res() res
  ): Promise<Response> {
    try {
      const tagName: string = req.body.tagName;
      const data: ReturnTagDto = await this.tagService.deleteTag(tagName);
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.DELETE_TAG_SUCCESS, data))
    
      } catch (error) {
      logger.error(error)
			if (error.response.statusCode === statusCode.BAD_REQUEST) {
				return res
					.status(statusCode.BAD_REQUEST)
					.send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST))
			}
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR))
    }
  }

}
