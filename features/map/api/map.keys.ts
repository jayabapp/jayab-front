export const mapKeys = {
  all: ["map"] as const,
  searches: () => [...mapKeys.all, "search"] as const,
  search: (term: string, center: number[]) =>
    [...mapKeys.searches(), { term, lat: center[1], lng: center[0] }] as const,
  reverse: (longitude: number, latitude: number) =>
    [...mapKeys.all, "reverse", { latitude, longitude }] as const,
};
