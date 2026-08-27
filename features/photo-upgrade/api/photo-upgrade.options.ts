import { PhotoUpgradeService } from "@/api_services/photo-upgrade/photo-upgrade.service";
import { photoUpgradeKeys } from "./photo-upgrade.keys";
import { queryOptions } from "@tanstack/react-query";

import { type PhotoUpgradeFilters } from "./photo-upgrade.keys";

export const photoUpgradeRequestsOptions = (
  filters: PhotoUpgradeFilters = {},
) =>
  queryOptions({
    queryKey: photoUpgradeKeys.list(filters),
    queryFn: async ({ signal }) =>
      (await PhotoUpgradeService.ownerRequests(filters, signal)) ?? [],
    staleTime: 30_000,
  });

export const photoUpgradeRequestOptions = (id: number) =>
  queryOptions({
    queryKey: photoUpgradeKeys.detail(id),
    queryFn: ({ signal }) => PhotoUpgradeService.ownerRequest({ id }, signal),
    enabled: Number.isInteger(id) && id > 0,
    staleTime: 30_000,
  });
