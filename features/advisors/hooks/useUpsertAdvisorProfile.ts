"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AdvisorService } from "@/api_services/advisor/advisor.propery";
import { advisorKeys } from "@features/advisors/api/advisor.keys";
import { authKeys } from "@features/auth/api/auth.keys";

export const useUpsertAdvisorProfile = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: AdvisorService.createAdvisor,
    onSuccess: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: advisorKeys.profile() }),
        client.invalidateQueries({ queryKey: advisorKeys.lists() }),
        client.invalidateQueries({ queryKey: authKeys.profile() }),
      ]),
  });
};
