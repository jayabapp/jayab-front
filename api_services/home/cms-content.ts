export const CMS_CONTENT_CACHE_KEY = "CONTENT_BY_KEY";

export const cmsContentQueryKey = (key: string) =>
  [CMS_CONTENT_CACHE_KEY, key] as const;
