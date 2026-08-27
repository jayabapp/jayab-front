"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AdvisorService } from "@/api_services/advisor/advisor.propery";
import { advisorKeys } from "../api/advisor.keys";
export const useRateAdvisor = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: AdvisorService.singleAdvisorRate,
    onSuccess: (_data, variables) => Promise.all([
      client.invalidateQueries({ queryKey: advisorKeys.detail(variables.advisorId ?? "") }),
      client.invalidateQueries({ queryKey: advisorKeys.lists() }),
    ]),
  });
};
