"use client";

import { useOwnerPropertyOptions } from "@features/owner-property/hooks/useOwnerPropertyOptions";
import { useOwnerPropertyStep } from "@features/owner-property/hooks/useOwnerPropertyStep";
import { usePropertyDraftForm } from "@features/owner-property/hooks/usePropertyDraftForm";
import { emptyTermsValues } from "@features/owner-property/mappers/property-draft.mapper";
import type { OwnerPropertyRouteProps } from "@/types/components/modules/owner-property";
import { toTermsValues } from "@features/owner-property/mappers/property-draft.mapper";
import type { PropertyTermsSendDto } from "@/types/components/modules/owner-property";
import { usePropertyRules } from "@features/owner-property/hooks/usePropertyRules";
import { MultiLineFormInput } from "@elements/Form";
import { useRouter } from "next/navigation";
import { FormInput } from "@elements/Form";
import { Checkbox } from "@elements/Form";
import { useState } from "react";

import PropertyEditStepSkeleton from "@features/owner-property/steps/PropertyEditStepSkeleton";
import PropertySuccessModal from "./parts/PropertySuccessModal.client";
import FieldCharacterCounter from "./parts/FieldCharacterCounter";
import PropertyStepFrame from "./parts/PropertyStepFrame.client";
import PropertyTermOption from "./parts/PropertyTermOption";
import _STRINGS from "@/utils/LocalStrings";
import Notify from "@elements/Toast";
import isArray from "lodash/isArray";

const DESCRIPTION_MAX_LENGTH = 1024;
const CANCELING_TYPES = ["STRICT", "NORMAL", "EASY"] as const;
const FALLBACK_RULE_TITLE = {
  EASY: _STRINGS.EASY_RULER,
  NORMAL: _STRINGS.NORMAL_RULER,
  STRICT: _STRINGS.STRICT_RULER,
};

const PropertyTermsStep = ({ propertyId }: OwnerPropertyRouteProps) => {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  const { draft, onChange, setValues, values } = usePropertyDraftForm(
    propertyId,
    emptyTermsValues,
    { canSeed: (saved) => !!saved?.canceling_type, map: toTermsValues },
  );
  const { data: propertyRules, isLoading: rulesLoading } = usePropertyRules();
  const { data: propertyTypes } = useOwnerPropertyOptions([
    "PARTY",
    "PET",
    "GUEST_TYPE",
  ]);

  const { isPending, submit } = useOwnerPropertyStep(
    "terms",
    propertyId,
    () => {
      if (!draft?.canceling_type) setShowSuccess(true);
    },
  );

  const onSubmit = () => {
    if (!values?.property_dscr)
      return Notify({ body: _STRINGS.PLACE_DESC_MAND, type: "warn" });
    if (!draft?.id) return;
    submit({ ...values, propertyId: draft?.id });
  };

  const toggleGuestType = (value: string | number | null) =>
    setValues((previous) => {
      const current = previous?.guest_type;
      if (!isArray(current)) return { ...previous, guest_type: [] };
      return {
        ...previous,
        guest_type: current.includes(value)
          ? current.filter((entry) => entry != value)
          : [...current, value],
      };
    });

  const descriptionField = (
    key: keyof PropertyTermsSendDto,
    title: string,
    options?: { isMandatory?: boolean; placeholder?: string; rows?: number },
  ) => (
    <MultiLineFormInput
      value={`${values?.[key] || ""}`}
      onChangeText={(entered) => onChange(entered, key)}
      item={{
        containerClass: "w-full relative col-span-full",
        extraElement: (
          <FieldCharacterCounter
            max={DESCRIPTION_MAX_LENGTH}
            value={`${values?.[key] || ""}`}
          />
        ),
        isMandatory: options?.isMandatory,
        maxLength: DESCRIPTION_MAX_LENGTH,
        placeholder: options?.placeholder ?? _STRINGS.DESCRIPTION_DOTS,
        rows: options?.rows ?? 3,
        title,
      }}
    />
  );

  return (
    <PropertyStepFrame
      step="terms"
      isPending={isPending}
      onSubmit={onSubmit}
      propertyId={propertyId}
      headerClass="w-full px-4 md:px-0 pb-4 pt-8"
      submitTitle={
        draft?.canceling_type ? _STRINGS.EDIT : _STRINGS.SUBMIT_PROPERTY
      }
    >
      {rulesLoading ? (
        <PropertyEditStepSkeleton variant="form" />
      ) : (
        <div className="flex flex-col gap-2 w-full">
          <p className="font-bold w-full text-start text-sm md:text-base text-brand-600">
            {propertyRules?.data?.[0]?.category?.title ||
              _STRINGS.CANCELATIONS_TITLE}
          </p>
          <p className="text-xs md:text-sm">
            {propertyRules?.data?.[0]?.category?.description || _STRINGS.LOREM}
          </p>

          <div className="flex flex-col my-2 gap-3">
            {CANCELING_TYPES.map((type) => {
              const rule = propertyRules?.data?.find(
                (entry) => entry?.key == type,
              );
              return (
                <PropertyTermOption
                  key={type}
                  desc={rule?.small_text || ""}
                  title={rule?.title || FALLBACK_RULE_TITLE[type]}
                  isChecked={values?.canceling_type == type}
                  onSelect={() => onChange(type, "canceling_type")}
                />
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 w-full">
        <p className="font-bold w-full text-start text-sm md:text-base text-brand-600">
          {_STRINGS.GUEST_TYPE_STATUS}
        </p>
        {propertyTypes?.["GUEST_TYPE"]?.map((option) => (
          <Checkbox
            rounded="rounded-md"
            title={option?.title}
            key={`GUEST_TYPE${option?.id}`}
            onSelect={() => toggleGuestType(option?.id)}
            isChecked={!!values?.guest_type?.includes(option?.id)}
          />
        ))}
        {descriptionField("guest_dscr", _STRINGS.MORE_DESC)}
      </div>

      <div className="flex flex-col gap-2 w-full">
        <p className="font-bold w-full text-start text-sm md:text-base text-brand-600">
          {_STRINGS.ANIMAL_RULES}
        </p>
        {propertyTypes?.["PET"]?.map((option) => (
          <Checkbox
            rounded="rounded-full"
            title={option?.title}
            key={`PET${option?.id}`}
            isChecked={values?.pet == option?.id}
            onSelect={() => onChange(option?.id, "pet")}
          />
        ))}
        {descriptionField("pet_dscr", _STRINGS.MORE_DESC)}
      </div>

      <div className="flex flex-col gap-2 w-full">
        <p className="font-bold w-full text-start text-sm md:text-base text-brand-600">
          {_STRINGS.PARTY_RULES}
        </p>
        {propertyTypes?.["PARTY"]?.map((option) => (
          <Checkbox
            rounded="rounded-full"
            title={option?.title}
            key={`PARTY${option?.id}`}
            isChecked={values?.party == option?.id}
            onSelect={() => onChange(option?.id, "party")}
          />
        ))}
        {descriptionField("party_dscr", _STRINGS.MORE_DESC)}
      </div>

      <div className="flex w-full items-center gap-4">
        <div className="flex items-center gap-2">
          <p className="shrink-0">{_STRINGS.ENTER_HOUR} :</p>
          <FormInput
            item={{}}
            value={values?.check_in_hour || ""}
            onChangeText={(entered) => onChange(entered, "check_in_hour")}
          />
        </div>
        <div className="flex items-center gap-2">
          <p className="shrink-0">{_STRINGS.END_HOUR} :</p>
          <FormInput
            item={{}}
            value={values?.check_out_hour || ""}
            onChangeText={(entered) => onChange(entered, "check_out_hour")}
          />
        </div>
      </div>

      {descriptionField("doc_dscr", _STRINGS.REQUIRED_DOCS, {
        isMandatory: true,
      })}
      {descriptionField("property_dscr", _STRINGS.PROP_DESC, {
        isMandatory: true,
        placeholder: `${_STRINGS.PROPERTY_DESCRIPTION_HINT}\n${_STRINGS.ABOUT_PROPERTY_DESCRIPTION}`,
        rows: 6,
      })}
      {descriptionField("other_dscr", _STRINGS.CANCEL_OTHER_DESC)}

      <PropertySuccessModal
        show={showSuccess}
        onConfirm={() =>
          router.push(`/profile/owner/properties/${propertyId}/subscription`)
        }
      />
    </PropertyStepFrame>
  );
};

export default PropertyTermsStep;
