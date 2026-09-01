"use client";

import type { OwnerPropertyStepFrameProps } from "@/types/components/modules/owner-property";
import { propertyStepIndex } from "@features/owner-property/lib/property-step-routes";
import { createPropertySteps } from "@/utils/constantss";

import PropertyEditStepSkeleton from "@features/owner-property/steps/PropertyEditStepSkeleton";
import FixedBottomContainer from "@elements/FixedBottomContainer";
import StepShower from "@elements/StepShower";
import Button from "@elements/Button";

const PropertyStepFrame = ({
  step,
  children,
  onSubmit,
  isLoading,
  isPending,
  propertyId,
  headerClass,
  submitTitle,
  skeleton = "form",
}: OwnerPropertyStepFrameProps) => (
  <>
    <div className={headerClass ?? "w-full pb-4 px-4 pt-8"}>
      <StepShower
        value={propertyStepIndex[step]}
        steps={createPropertySteps(Number(propertyId)) || []}
      />
    </div>

    {isLoading ? <PropertyEditStepSkeleton variant={skeleton} /> : children}

    <FixedBottomContainer>
      <Button
        title={submitTitle}
        onClick={onSubmit}
        loading={isPending}
        disabled={isPending}
        width=" w-[90%] md:w-1/2"
        roundedClass="rounded-full"
        containerClass="w-full flex items-center justify-center"
      />
    </FixedBottomContainer>
  </>
);

export default PropertyStepFrame;
