"use client";

import type { PropertySubsDto } from "@/types/features/owner-property";
import { useOwnerSubscriptionPlans } from "@features/owner-property/hooks/useOwnerSubscription";
import { useOwnerProperty } from "@features/owner-property/hooks/useOwnerProperty";
import { useMemo, useState } from "react";

const ONE_DAY_PLAN_ID = 1;

export const useOwnerSubscriptionSelection = (propertyId: string | number) => {
  const { data: plans } = useOwnerSubscriptionPlans(propertyId);
  const { data: property } = useOwnerProperty(propertyId);

  const canPromote = !!plans?.can_promote;
  const promoteItem = plans?.list?.find((plan) => plan.is_promote);
  const seedKey = `${plans?.list?.length ?? 0}|${canPromote}`;

  const [selection, setSelection] = useState<{
    key: string;
    plans: PropertySubsDto[];
  }>({ key: "", plans: [] });

  let current = selection;
  if (!!plans?.list?.length && current.key !== seedKey) {
    current = {
      key: seedKey,
      plans: canPromote && promoteItem ? [promoteItem] : [],
    };
  }
  if (current !== selection) setSelection(current);

  const shownPlans = useMemo(() => {
    if (!plans?.list) return [];
    if (!property?.remaining_days && canPromote) return plans.list;
    return plans.list.filter((plan) => plan?.id != ONE_DAY_PLAN_ID);
  }, [plans, property, canPromote]);

  const selectedPlans = current.plans;
  const price = selectedPlans.reduce(
    (total, plan) => total + (plan.price_with_discount || plan.price),
    0,
  );

  const toggle = (plan: PropertySubsDto) =>
    setSelection((previous) => {
      const chosen = previous.plans;
      if (chosen.some((entry) => entry.id === plan.id))
        return {
          ...previous,
          plans: chosen.filter((entry) => entry.id !== plan.id),
        };
      return {
        ...previous,
        plans: plan.is_promote
          ? chosen.filter((entry) => !entry.is_promote).concat(plan)
          : chosen.filter((entry) => entry.is_promote).concat(plan),
      };
    });

  return {
    canPromote,
    lockedPromoteId: canPromote ? undefined : promoteItem?.id,
    price,
    promoteId: selectedPlans.find((plan) => plan.is_promote)?.id,
    property,
    selectedPlans,
    shownPlans,
    subscriptionId: selectedPlans.find((plan) => !plan.is_promote)?.id,
    toggle,
  };
};
