"use client";

import { usePurchaseAdvisorPlan } from "@features/advisors/hooks/useAdvisorSubscription";
import { useEffect, useRef } from "react";
import { useAdvisorPlans } from "@features/advisors/hooks/useAdvisorPlans";

const PAYMENT_COOLDOWN_MS = 2 * 60_000;
const paymentStorageKey = (payKey: string) => `advisor-payment:${payKey}`;

export const useAdvisorPlanCheckout = (payKey: string | null) => {
  const { data: plans, isFetched, isFetching } = useAdvisorPlans();
  const { mutate, isPending } = usePurchaseAdvisorPlan();
  const started = useRef(false);

  useEffect(() => {
    if (!payKey || started.current) return;
    if (!isFetched || isFetching) return;

    const list = plans?.list ?? [];
    if (list.length === 0) return;

    const storageKey = paymentStorageKey(payKey);
    const lastStartedAt = Number(sessionStorage.getItem(storageKey));
    if (lastStartedAt && Date.now() - lastStartedAt < PAYMENT_COOLDOWN_MS)
      return;

    const plan =
      payKey === "is-especial"
        ? list.find((entry) => !!entry?.is_special)
        : list.find((entry) => !entry?.is_special);
    if (!plan?.id) return;

    started.current = true;
    sessionStorage.setItem(storageKey, String(Date.now()));
    mutate(
      {
        gateway: process.env.NEXT_PUBLIC_PAYMENT_GATEWAY || "",
        plan_id: plan.id,
        redirect_url: `${window.origin}/profile/advisor/subscription`,
      },
      {
        onError: () => {
          started.current = false;
          sessionStorage.removeItem(storageKey);
        },
      },
    );
  }, [isFetched, isFetching, mutate, payKey, plans]);

  return { isPending };
};
