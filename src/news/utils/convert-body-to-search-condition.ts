import { SearchCondition } from "../common/search-condition"

export const convertBodyToSearchCondition = (body: object): SearchCondition => {
  const channels = body["channel"];
  const categories = body["category"];
  const announcerGender = body["announcerGender"];
  const currentPage = body["currentPage"];
  const listSize = body["listSize"];
  const searchCondition: SearchCondition = new SearchCondition(
    channels,
    categories,
    announcerGender,
    currentPage,
    listSize,
  );
  return searchCondition;
}
