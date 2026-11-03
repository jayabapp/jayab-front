import { CityService } from "@/api_services/city/city.service";
import { GC_TIME, STALE_TIME } from "@/helpers/queryCache";
import { queryOptions } from "@tanstack/react-query";
import { cityKeys } from "./cities.keys";

export const cityTreeOptions = () =>
  queryOptions({
    queryKey: cityKeys.tree(),
    queryFn: ({ signal }) => CityService.GetAllCities({ is_parent: 1 }, signal),
    staleTime: STALE_TIME.LONG,
    gcTime: GC_TIME.LONG,
  });
