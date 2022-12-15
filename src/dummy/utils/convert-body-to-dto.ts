import { CreateMemoGuideDto } from '../dto/create-memo-guide.dto';
import { CreateSentenceDefaultDto } from '../dto/create-sentence-default.dto';
import { CreateSentenceGuideDto } from '../dto/create-sentence-guide.dto';
import { UpdateSentenceDefaultDto } from '../dto/update-sentence-default.dto';
import { UpdateSentenceGuideDto } from '../dto/update-sentence-guide.dto';

export const convertBodyToCreateSentenceDefaultDto = (
  body: any,
): CreateSentenceDefaultDto => {
  const createSentenceDefaultDto: CreateSentenceDefaultDto =
    new CreateSentenceDefaultDto();
  createSentenceDefaultDto.newsId = body.newsId;
  createSentenceDefaultDto.order = body.order;
  createSentenceDefaultDto.startTime = body.startTime;
  createSentenceDefaultDto.endTime = body.endTime;
  createSentenceDefaultDto.text = body.text;
  return createSentenceDefaultDto;
};

export const convertBodyToUpdateSentenceDefaultDto = (
  body: any,
): UpdateSentenceDefaultDto => {
  const updateSentenceDefaultDto: UpdateSentenceDefaultDto =
    new UpdateSentenceDefaultDto();
  updateSentenceDefaultDto.sentenceDefaultId = body.sentenceDefaultId;
  updateSentenceDefaultDto.order = body.order;
  updateSentenceDefaultDto.startTime = body.startTime;
  updateSentenceDefaultDto.endTime = body.endTime;
  updateSentenceDefaultDto.text = body.text;
  return updateSentenceDefaultDto;
};

export const convertBodyToCreateSentenceGuideDto = (
  body: any,
): CreateSentenceGuideDto => {
  const createSentenceGuideDto: CreateSentenceGuideDto =
    new CreateSentenceGuideDto();
  createSentenceGuideDto.newsId = body.newsId;
  createSentenceGuideDto.order = body.order;
  createSentenceGuideDto.startTime = body.startTime;
  createSentenceGuideDto.endTime = body.endTime;
  createSentenceGuideDto.text = body.text;
  return createSentenceGuideDto;
};

export const convertBodyToUpdateSentenceGuideDto = (
  body: any,
): UpdateSentenceGuideDto => {
  const updateSentenceGuideDto: UpdateSentenceGuideDto =
    new UpdateSentenceGuideDto();
  updateSentenceGuideDto.sentenceGuideId = body.sentenceGuideId;
  updateSentenceGuideDto.order = body.order;
  updateSentenceGuideDto.startTime = body.startTime;
  updateSentenceGuideDto.endTime = body.endTime;
  updateSentenceGuideDto.text = body.text;
  return updateSentenceGuideDto;
};

export const convertBodyToCreateMemoGuideDto = (
  body: any,
): CreateMemoGuideDto => {
  const createMemoGuideDto: CreateMemoGuideDto = new CreateMemoGuideDto();
  createMemoGuideDto.newsId = body.newsId;
  createMemoGuideDto.order = body.order;
  createMemoGuideDto.startIndex = body.startIndex;
  createMemoGuideDto.content = body.content;
  return createMemoGuideDto;
};
