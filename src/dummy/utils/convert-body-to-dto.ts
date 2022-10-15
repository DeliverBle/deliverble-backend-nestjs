import { CreateSentenceDefaultDto } from "../dto/create-sentence-default.dto"

export const convertBodyToCreateSentenceDefaultDto = (body: any): CreateSentenceDefaultDto => {
  const createSentenceDefaultDto: CreateSentenceDefaultDto = new CreateSentenceDefaultDto()
  createSentenceDefaultDto.newsId = body.newsId;
  createSentenceDefaultDto.order = body.order;
  createSentenceDefaultDto.startTime = body.startTime;
  createSentenceDefaultDto.endTime = body.endTime;
  createSentenceDefaultDto.text = body.text;
  return createSentenceDefaultDto;
}
