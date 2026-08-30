import { HomeService } from "@/api_services/home/home.service";
import { queryOptions } from "@tanstack/react-query";
import { STALE_TIME } from "@/helpers/queryCache";
import { searchKeys } from "./search.keys";

export const searchSuggestionsOptions = (normalizedTerm: string) =>
  queryOptions({
    queryKey: searchKeys.suggestions(normalizedTerm),
    queryFn: ({ signal }) => HomeService.GetSearchSuggs({ q: normalizedTerm }, signal),
    enabled: normalizedTerm.length >= 2,
    staleTime: STALE_TIME.MEDIUM,
  });
