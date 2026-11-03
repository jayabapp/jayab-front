"use client";

import { ownerPropertyKeys } from "../api/owner-property.keys";
import { PropertyService } from "@/api_services/property/property.service";
import { useQuery } from "@tanstack/react-query";

type OwnerPropertyGroups = Parameters<
  typeof PropertyService.GetUserPropertyGroup
>[0]["group"];

export const useOwnerPropertyOptions = (groups: OwnerPropertyGroups) =>
  useQuery({
    queryKey: [...ownerPropertyKeys.all, "options", [...groups].sort()],
    queryFn: () => PropertyService.GetUserPropertyGroup({ group: groups }),
    staleTime: 5 * 60_000,
  });
