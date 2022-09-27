export interface ConditionList {
  channels: boolean;
  categories: boolean;
  announcerGender: boolean;
  findAll: boolean;
}

export const hasCategories = (conditionList: ConditionList): boolean => {
  return conditionList.categories;
};

export const hasChannels = (conditionList: ConditionList): boolean => {
  return conditionList.channels;
};

export const hasAnnouncerGender = (conditionList: ConditionList): boolean => {
  return conditionList.announcerGender;
};

export const hasFindAll = (conditionList: ConditionList): boolean => {
  return conditionList.findAll;
};
