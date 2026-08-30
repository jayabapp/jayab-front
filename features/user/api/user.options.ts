import type { UserSubscriptionFilters } from "@/types/features/user";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { AdvisorService } from "@/api_services/advisor/advisor.propery";
import { PropertyService } from "@/api_services/property/property.service";
import { UserService } from "@/api_services/user/user.service";
import { userKeys } from "@features/user/api/user.keys";

const DEFAULT_PAGE_SIZE = 20;

export const userSubscriptionsOptions = (filters: UserSubscriptionFilters) => {
  const perPage = filters.perPage ?? DEFAULT_PAGE_SIZE;

  const keyFilters = {
    from: filters.from ? new Date(filters.from).toISOString() : undefined,
    to: filters.to ? new Date(filters.to).toISOString() : undefined,
  };

  return infiniteQueryOptions({
    queryKey: userKeys.subscriptionList(keyFilters),
    queryFn: ({ pageParam, signal }) =>
      UserService.getUserSubscriptions(
        { ...filters, cursor: pageParam },
        signal,
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.data.length < perPage) return undefined;
      return lastPage.data.at(-1)?.id;
    },
    staleTime: 30_000,
  });
};

export const userBookmarksOptions = () =>
  queryOptions({
    queryKey: userKeys.bookmarks(),
    queryFn: ({ signal }) => PropertyService.getBookMarks(signal),
    staleTime: 30_000,
  });

export const referralProfileOptions = () =>
  queryOptions({
    queryKey: userKeys.referral(),
    queryFn: () => AdvisorService.userAdvisorsProfile(),
    staleTime: 0,
    gcTime: 0,
  });
