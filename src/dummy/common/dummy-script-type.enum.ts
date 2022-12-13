export const DUMMY_SCRIPT_TYPE = {
  Default: 'default',
  Guide: 'guide',
} as const;

export type DUMMY_SCRIPT_TYPE =
  typeof DUMMY_SCRIPT_TYPE[keyof typeof DUMMY_SCRIPT_TYPE];
