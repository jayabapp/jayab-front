"use client";

import { emptyAssistantValues } from "@features/owner-property/mappers/property-draft.mapper";
import { useOwnerPropertyStep } from "@features/owner-property/hooks/useOwnerPropertyStep";
import { usePropertyDraftForm } from "@features/owner-property/hooks/usePropertyDraftForm";
import { toAssistantValues } from "@features/owner-property/mappers/property-draft.mapper";
import type { OwnerPropertyRouteProps } from "@/types/components/modules/owner-property";
import { FormInput } from "@elements/Form";
import { Checkbox } from "@elements/Form";

import PropertyStepFrame from "./parts/PropertyStepFrame.client";
import _STRINGS from "@/utils/LocalStrings";
import Notify from "@elements/Toast";

const ASSISTANT_REQUIRED_MODES = [2, 3];
const MOBILE_MAX_LENGTH = 11;

const PropertyAssistantsStep = ({ propertyId }: OwnerPropertyRouteProps) => {
  const { draft, isLoading, onChange, values } = usePropertyDraftForm(
    propertyId,
    emptyAssistantValues,
    { canSeed: (saved) => !!saved?.contact_type, map: toAssistantValues },
  );
  const { isPending, submit } = useOwnerPropertyStep("assistants", propertyId);

  const onSubmit = () => {
    const needsAssistant = ASSISTANT_REQUIRED_MODES.includes(
      Number(values?.show_mobile_type),
    );
    if (needsAssistant && !`${values?.assistant_full_name || ""}`.trim())
      return Notify({ body: _STRINGS.ENTER_ASSISTANT_NAME, type: "warn" });
    if (needsAssistant && !`${values?.assistant_mobile || ""}`.trim())
      return Notify({ body: _STRINGS.ENTER_ASSISTANT_PHONE, type: "warn" });
    if (!draft?.id) return;

    submit({
      assistant_full_name: values?.assistant_full_name || undefined,
      assistant_mobile: values?.assistant_mobile || undefined,
      propertyId: draft?.id,
      show_mobile_type: values?.show_mobile_type || undefined,
    });
  };

  return (
    <PropertyStepFrame
      step="assistants"
      isPending={isPending}
      isLoading={isLoading}
      onSubmit={onSubmit}
      propertyId={propertyId}
      submitTitle={_STRINGS.SUBMIT_MOVE_ON}
      headerClass="w-full px-4 md:px-0 pb-4 pt-8"
    >
      <div className="flex flex-col gap-2 w-full">
        <Checkbox
          rounded="rounded-full"
          title={_STRINGS.SHOW_OWNERS_PHONE}
          isChecked={values?.show_mobile_type == 1}
          onSelect={() => onChange(1, "show_mobile_type")}
        />
        <Checkbox
          rounded="rounded-full"
          title={_STRINGS.SHOW_ASSISTANT_PHONE}
          isChecked={values?.show_mobile_type == 2}
          onSelect={() => onChange(2, "show_mobile_type")}
        />
        <Checkbox
          rounded="rounded-full"
          title={_STRINGS.SHOW_BOTH_PHONE}
          isChecked={values?.show_mobile_type == 3}
          onSelect={() => onChange(3, "show_mobile_type")}
        />
      </div>

      {values?.show_mobile_type != 1 ? (
        <>
          <FormInput
            value={values?.assistant_full_name || ""}
            onChangeText={(entered) => onChange(entered, "assistant_full_name")}
            item={{
              containerClass: "w-full",
              isMandatory: true,
              title: _STRINGS.ASSISTANT_NAME,
            }}
          />
          <FormInput
            value={values?.assistant_mobile || ""}
            onChangeText={(entered) => onChange(entered, "assistant_mobile")}
            item={{
              containerClass: "w-full",
              isMandatory: true,
              keyboard: "number",
              maxLength: MOBILE_MAX_LENGTH,
              title: _STRINGS.ASSISTANT_PHONE,
            }}
          />
        </>
      ) : null}
    </PropertyStepFrame>
  );
};

export default PropertyAssistantsStep;
