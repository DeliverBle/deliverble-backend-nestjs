import { Script } from "../entity/script.entity";

export const SCRIPTS_COUNT_CHECK = {
  Full: 'full',
  Available: 'available',
  Empty: 'empty'
} as const;

export type SCRIPTS_COUNT_CHECK = typeof SCRIPTS_COUNT_CHECK[keyof typeof SCRIPTS_COUNT_CHECK];

export const scriptsCountCheck = (scripts: Script[]): SCRIPTS_COUNT_CHECK => {
  if (scripts.length === 0) {
    return SCRIPTS_COUNT_CHECK.Empty;
  }
  if (scripts.length >= 3) {
    return SCRIPTS_COUNT_CHECK.Full;
  }
  return SCRIPTS_COUNT_CHECK.Available;
}
