"use client";

import { ownerPropertyKeys } from "../api/owner-property.keys";
import { HomeService } from "@/api_services/home/home.service";
import { useQuery } from "@tanstack/react-query";

export const usePropertyRules = () =>
  useQuery({
    queryKey: [...ownerPropertyKeys.all, "rules"],
    queryFn: () => HomeService.GetContent({ key: "propertyRules", page: 1 }),
    staleTime: 5 * 60_000,
  });
