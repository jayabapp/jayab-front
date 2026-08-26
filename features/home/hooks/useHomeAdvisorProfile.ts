"use client";

import { AdvisorService } from "@/api_services/advisor/advisor.propery";
import { STALE_TIME } from "@/helpers/queryCache";
import { useQuery } from "@tanstack/react-query";

export const useHomeAdvisorProfile = (isLogin: boolean) =>
  useQuery({
    queryKey: ["home", "advisor-profile", isLogin],
    queryFn: AdvisorService.userAdvisorsProfile,
    enabled: isLogin,
    staleTime: STALE_TIME.DEFAULT,
  });
