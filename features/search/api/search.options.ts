import { cityKeys, searchKeys } from "./search.keys";
import { GC_TIME, STALE_TIME } from "@/helpers/queryCache";
import { queryOptions } from "@tanstack/react-query";
import { CityService } from "@/api_services/city/city.service";
import { HomeService } from "@/api_services/home/home.service";

export const cityTreeOptions = () =>
  queryOptions({
    queryKey: cityKeys.tree(),
    queryFn: ({ signal }) => CityService.GetAllCities({ is_parent: 1 }, signal),
    staleTime: STALE_TIME.LONG,
    gcTime: GC_TIME.LONG,
  });

export const searchSuggestionsOptions = (normalizedTerm: string) =>
  queryOptions({
    queryKey: searchKeys.suggestions(normalizedTerm),
    queryFn: ({ signal }) =>
      HomeService.GetSearchSuggs({ q: normalizedTerm }, signal),
    enabled: normalizedTerm.length >= 2,
    staleTime: STALE_TIME.MEDIUM,
  });
