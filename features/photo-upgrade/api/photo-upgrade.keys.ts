export type PhotoUpgradeFilters = { property_id?: number };

export const photoUpgradeKeys = {
  all: ["photo-upgrade"] as const,
  lists: () => [...photoUpgradeKeys.all, "list"] as const,
  list: (filters: PhotoUpgradeFilters = {}) =>
    [...photoUpgradeKeys.lists(), filters] as const,
  details: () => [...photoUpgradeKeys.all, "detail"] as const,
  detail: (id: number) => [...photoUpgradeKeys.details(), id] as const,
};
