"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AdvisorService } from "@/api_services/advisor/advisor.propery";
import { advisorKeys } from "../api/advisor.keys";
export const useUpsertAdvisorProfile = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: AdvisorService.createAdvisor,
    onSuccess: () => Promise.all([
      client.invalidateQueries({ queryKey: advisorKeys.profile() }),
      client.invalidateQueries({ queryKey: advisorKeys.lists() }),
    ]),
  });
};
