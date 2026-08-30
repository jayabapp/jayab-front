"use client";

import { emptyEnvironmentValues } from "@features/owner-property/mappers/property-draft.mapper";
import { toEnvironmentValues } from "@features/owner-property/mappers/property-draft.mapper";
import { useOwnerPropertyStep } from "@features/owner-property/hooks/useOwnerPropertyStep";
import { usePropertyDraftForm } from "@features/owner-property/hooks/usePropertyDraftForm";
import type { OwnerPropertyRouteProps } from "@/types/components/modules/owner-property";

import PropertyEnvironmentFields from "./parts/PropertyEnvironmentFields.client";
import PropertyStepFrame from "./parts/PropertyStepFrame.client";
import _STRINGS from "@/utils/LocalStrings";

const PropertyEnvironmentStep = ({ propertyId }: OwnerPropertyRouteProps) => {
  const { draft, isLoading, onChange, values } = usePropertyDraftForm(
    propertyId,
    emptyEnvironmentValues,
    { map: toEnvironmentValues },
  );
  const { isPending, submit } = useOwnerPropertyStep("environment", propertyId);

  const onSubmit = () => {
    if (!draft?.id) return;
    submit({ ...values, propertyId: draft?.id });
  };

  return (
    <PropertyStepFrame
      step="environment"
      onSubmit={onSubmit}
      isPending={isPending}
      isLoading={isLoading}
      propertyId={propertyId}
      submitTitle={_STRINGS.SUBMIT_MOVE_ON}
    >
      <PropertyEnvironmentFields values={values} onChange={onChange} />
    </PropertyStepFrame>
  );
};

export default PropertyEnvironmentStep;
