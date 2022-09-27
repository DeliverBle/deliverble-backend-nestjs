export const TOGGLE_FAVORITE = {
  Add: 'add',
  Delete: 'delete'
} as const;

export type TOGGLE_FAVORITE = typeof TOGGLE_FAVORITE[keyof typeof TOGGLE_FAVORITE];
