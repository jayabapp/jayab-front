"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AdvisorService } from "@/api_services/advisor/advisor.propery";
import { advisorKeys } from "../api/advisor.keys";
import { getSafePaymentUrl } from "../lib/safe-payment-url";

export const usePurchaseAdvisorPlan = () => useMutation({
  mutationFn: async (payload: Parameters<typeof AdvisorService.payAdvisorPlan>[0]) => {
    const response = await AdvisorService.payAdvisorPlan(payload);
    const destination = getSafePaymentUrl(response);
    if (!destination) throw new Error("INVALID_PAYMENT_REDIRECT_URL");
    return destination;
  },
  onSuccess: (destination) => window.location.assign(destination),
});

export const useCancelAdvisorSubscription = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: AdvisorService.deleteAdvisorSub,
    onSuccess: () => client.invalidateQueries({ queryKey: advisorKeys.profile() }),
  });
};
