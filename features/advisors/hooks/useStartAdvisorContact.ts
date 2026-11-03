"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AdvisorService } from "@/api_services/advisor/advisor.propery";
import { advisorKeys } from "../api/advisor.keys";
export const useStartAdvisorContact = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: AdvisorService.singleAdvisorInitContact,
    onSuccess: (_data, variables) => client.invalidateQueries({ queryKey: advisorKeys.detail(variables.advisorId ?? "") }),
  });
};
