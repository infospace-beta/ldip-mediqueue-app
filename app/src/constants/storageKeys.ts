/**Keys used for browser storage - keep them here so none is typed twice */
export const STORAGE_KEYS = {
  user: "user",
  token: "x-token",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
