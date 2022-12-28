import { ReturnEventUserDto } from "../dto/return-event-user.dto";
import { ReturnEventUserDtoCollection } from "../dto/return-news-collection.dto copy";
import { EventUser } from "../event-user.entity";

export const changeReturnEventUserListToDto = (
  eventUsers: EventUser[],
): ReturnEventUserDtoCollection => {
  const returnEventDtoList: ReturnEventUserDto[] = eventUsers.map(
    (eventUser) => new ReturnEventUserDto(eventUser),
  );
  const returnEventUserDtoCollection: ReturnEventUserDtoCollection =
    new ReturnEventUserDtoCollection(returnEventDtoList);
  return returnEventUserDtoCollection;
};
