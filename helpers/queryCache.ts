export const STALE_TIME = {
  REALTIME: 0,
  SHORT: 30 * 1000,
  DEFAULT: 60 * 1000,
  LONG: 30 * 60 * 1000,
  MEDIUM: 5 * 60 * 1000,
} as const;

export const GC_TIME = {
  IMMEDIATE: 0,
  LONG: 30 * 60 * 1000,
  DEFAULT: 5 * 60 * 1000,
} as const;
