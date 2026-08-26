export const ownerPropertyKeys = {
  all: ["owner-properties"] as const,
  lists: () => [...ownerPropertyKeys.all, "list"] as const,
  list: () => [...ownerPropertyKeys.lists()] as const,
  details: () => [...ownerPropertyKeys.all, "detail"] as const,
  detail: (id: string | number) => [...ownerPropertyKeys.details(), String(id)] as const,
  drafts: () => [...ownerPropertyKeys.all, "draft"] as const,
  draft: (id: string | number) => [...ownerPropertyKeys.drafts(), String(id)] as const,
  calendar: (id: string | number, year: number | string, month: number | string) =>
    [...ownerPropertyKeys.all, "calendar", String(id), String(year), String(month)] as const,
  priceLimits: (id: string | number, date: string) =>
    [...ownerPropertyKeys.all, "price-limits", String(id), date] as const,
  badge: (id: string | number) => [...ownerPropertyKeys.all, "badge", String(id)] as const,
  authorization: (id: string | number) =>
    [...ownerPropertyKeys.all, "authorization", String(id)] as const,
  statistics: (id: string | number) =>
    [...ownerPropertyKeys.all, "statistics", String(id)] as const,
  subscriptions: (id: string | number) =>
    [...ownerPropertyKeys.all, "subscriptions", String(id)] as const,
};
