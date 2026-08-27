"use client";
import { useQuery } from "@tanstack/react-query";
import { CityService } from "@/api_services/city/city.service";

export const useAdvisorLocations = (provinceId?: string | number | null) => {
  const provinces = useQuery({
    queryKey: ["advisor-locations", "provinces"],
    queryFn: ({ signal }) => CityService.GetAllCities({ is_parent: 1 }, signal),
    staleTime: 10 * 60_000,
  });
  const cities = useQuery({
    queryKey: ["advisor-locations", "cities", provinceId],
    queryFn: () => CityService.GetCities({ parentId: provinceId! }),
    enabled: Boolean(provinceId),
    staleTime: 10 * 60_000,
  });
  return { provinces: provinces.data ?? [], cities: cities.data ?? [] };
};
