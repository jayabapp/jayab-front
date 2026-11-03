import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { advisorKeys, type AdvisorFilters } from "./advisor.keys";
import { PropertyService } from "@/api_services/property/property.service";
import { AdvisorService } from "@/api_services/advisor/advisor.propery";

const PAGE_SIZE = 20;

export const advisorsOptions = (filters: AdvisorFilters) =>
  infiniteQueryOptions({
    queryKey: advisorKeys.list(filters),
    initialPageParam: 0,
    queryFn: async ({ pageParam, signal }) =>
      (await AdvisorService.userAdvisorsList(
        {
          ...filters,
          cursor: Number(pageParam),
          per_page: PAGE_SIZE,
        },
        signal,
      )) ?? [],
    getNextPageParam: (lastPage) =>
      !lastPage || lastPage.length < PAGE_SIZE
        ? undefined
        : (lastPage[lastPage.length - 1]?.id ?? undefined),
    staleTime: 60_000,
  });

export const advisorProfileOptions = (enabled = true) =>
  queryOptions({
    queryKey: advisorKeys.profile(),
    queryFn: ({ signal }) => AdvisorService.userAdvisorsProfile(signal),
    enabled,
    staleTime: 30_000,
  });

export const advisorDetailOptions = (id: number | string, enabled = true) =>
  queryOptions({
    queryKey: advisorKeys.detail(id),
    queryFn: ({ signal }) =>
      AdvisorService.singleAdvisor({ advisorId: id }, signal),
    enabled: enabled && Boolean(id),
    staleTime: 60_000,
  });

export const advisorPlansOptions = () =>
  queryOptions({
    queryKey: advisorKeys.plans(),
    queryFn: ({ signal }) =>
      PropertyService.GetPropertySubscriptionPlans({ type: "ADVISOR" }, signal),
    staleTime: 5 * 60_000,
  });
