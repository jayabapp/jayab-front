export type AdvisorFilters = {
  q?: string;
  cities?: Array<number | string>;
  province_id?: number | string;
};

export const advisorKeys = {
  all: ["advisors"] as const,
  lists: () => [...advisorKeys.all, "list"] as const,
  list: (filters: AdvisorFilters) => [...advisorKeys.lists(), filters] as const,
  profile: () => [...advisorKeys.all, "profile"] as const,
  details: () => [...advisorKeys.all, "detail"] as const,
  detail: (id: number | string) => [...advisorKeys.details(), id] as const,
  plans: () => [...advisorKeys.all, "plans"] as const,
};
