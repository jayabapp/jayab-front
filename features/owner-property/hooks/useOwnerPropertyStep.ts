"use client";

import type { PropertyDraftStep } from "@/types/features/owner-property";
import { usePropertyDraftStep } from "@features/owner-property/hooks/usePropertyDraftStep";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

import {
  nextPropertyStep,
  ownerPropertyEditRoute,
  ownerPropertyStepRoute,
} from "@features/owner-property/lib/property-step-routes";

export const useOwnerPropertyStep = (
  step: PropertyDraftStep,
  propertyId: string | number,
  onSaved?: () => void,
) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = !!searchParams.get("edit_mode");
  const isNavigating = useRef(false);

  const { mutate, isPending } = usePropertyDraftStep(step, propertyId, () => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    if (isEditMode) {
      router.replace(ownerPropertyEditRoute(propertyId));
      return;
    }
    if (onSaved) {
      isNavigating.current = false;
      onSaved();
      return;
    }
    const next = nextPropertyStep(step);
    if (next) router.push(ownerPropertyStepRoute(propertyId, next));
    else isNavigating.current = false;
  });

  const submit = (variables: Parameters<typeof mutate>[0]) => {
    if (isPending || isNavigating.current) return;
    mutate(variables);
  };

  return { isEditMode, isPending, submit };
};
