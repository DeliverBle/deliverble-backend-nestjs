import { CreateSentenceDefaultDto } from "../dto/create-sentence-default.dto"
import { UpdateSentenceDefaultDto } from "../dto/update-sentence-default.dto";

export const convertBodyToCreateSentenceDefaultDto = (body: any): CreateSentenceDefaultDto => {
  const createSentenceDefaultDto: CreateSentenceDefaultDto = new CreateSentenceDefaultDto()
  createSentenceDefaultDto.newsId = body.newsId;
  createSentenceDefaultDto.order = body.order;
  createSentenceDefaultDto.startTime = body.startTime;
  createSentenceDefaultDto.endTime = body.endTime;
  createSentenceDefaultDto.text = body.text;
  return createSentenceDefaultDto;
}

export const convertBodyToUpdateSentenceDefaultDto = (body: any): UpdateSentenceDefaultDto => {
  const updateSentenceDefaultDto: UpdateSentenceDefaultDto = new UpdateSentenceDefaultDto()
  updateSentenceDefaultDto.sentenceDefaultId = body.sentenceDefaultId;
  updateSentenceDefaultDto.order = body.order;
  updateSentenceDefaultDto.startTime = body.startTime;
  updateSentenceDefaultDto.endTime = body.endTime;
  updateSentenceDefaultDto.text = body.text;
  return updateSentenceDefaultDto;
}
