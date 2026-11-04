"use client";

import { CityService } from "@/api_services/city/city.service";
import { useQuery } from "@tanstack/react-query";
import { resolveLocale } from "@/i18n/config";
import { useLocale } from "next-intl";

export const useAdvisorLocations = (provinceId?: string | number | null) => {
  const locale = resolveLocale(useLocale());
  const provinces = useQuery({
    queryKey: ["advisor-locations", "provinces", locale],
    queryFn: ({ signal }) =>
      CityService.GetAllCities({ is_parent: 1, locale }, signal),
    staleTime: 10 * 60_000,
  });
  const cities = useQuery({
    queryKey: ["advisor-locations", "cities", provinceId, locale],
    queryFn: () => CityService.GetCities({ parentId: provinceId!, locale }),
    enabled: Boolean(provinceId),
    staleTime: 10 * 60_000,
  });
  return { provinces: provinces.data ?? [], cities: cities.data ?? [] };
};
