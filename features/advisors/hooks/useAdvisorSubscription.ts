"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getSafePaymentUrl } from "@features/advisors/lib/safe-payment-url";
import { AdvisorService } from "@/api_services/advisor/advisor.propery";
import { advisorKeys } from "@features/advisors/api/advisor.keys";
import { authKeys } from "@features/auth/api/auth.keys";
import { useRef } from "react";

export const usePurchaseAdvisorPlan = () => {
  const inFlight = useRef(false);
  return useMutation({
    mutationFn: async (
      payload: Parameters<typeof AdvisorService.payAdvisorPlan>[0],
    ) => {
      if (inFlight.current) throw new Error("ADVISOR_PAYMENT_ALREADY_STARTED");
      inFlight.current = true;
      try {
        const response = await AdvisorService.payAdvisorPlan(payload);
        const destination = getSafePaymentUrl(response);
        if (!destination) throw new Error("INVALID_PAYMENT_REDIRECT_URL");
        return destination;
      } catch (error) {
        inFlight.current = false;
        throw error;
      }
    },
    onSuccess: (destination) => window.location.assign(destination),
  });
};

export const useCancelAdvisorSubscription = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: AdvisorService.deleteAdvisorSub,
    onSuccess: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: advisorKeys.profile() }),
        client.invalidateQueries({ queryKey: authKeys.profile() }),
      ]),
  });
};
