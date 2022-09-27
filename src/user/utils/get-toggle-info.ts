import { TOGGLE_FAVORITE } from "../common/toggle-favorite.type";

export const getToggleInfo = (addOrDelete: TOGGLE_FAVORITE): boolean => {
  if (addOrDelete === TOGGLE_FAVORITE.Add) {
    return true;
  }
  return false;
}
