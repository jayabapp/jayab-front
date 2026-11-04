import { CityService } from "@/api_services/city/city.service";
import { GC_TIME, STALE_TIME } from "@/helpers/queryCache";
import { queryOptions } from "@tanstack/react-query";
import { cityKeys } from "./cities.keys";

import type { Locale } from "@/i18n/config";

export const cityTreeOptions = (locale: Locale) =>
  queryOptions({
    queryKey: cityKeys.tree(locale),
    queryFn: ({ signal }) =>
      CityService.GetAllCities({ is_parent: 1, locale }, signal),
    staleTime: STALE_TIME.LONG,
    gcTime: GC_TIME.LONG,
  });
