import queryBuilder from "@/helpers/queryBuilder";

export const withQuery = (
  path: string,
  params: Record<string, unknown> = {},
): string => {
  const search = queryBuilder(params);
  return search ? `${path}?${search}` : path;
};
