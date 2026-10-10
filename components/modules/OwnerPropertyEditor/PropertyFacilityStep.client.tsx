"use client";

import { MultiSelectPopUpSelect as MultyPopUpSelect } from "@elements/Form";
import { useOwnerPropertyOptions } from "@features/owner-property/hooks/useOwnerPropertyOptions";
import { useOwnerPropertyStep } from "@features/owner-property/hooks/useOwnerPropertyStep";
import { usePropertyDraftForm } from "@features/owner-property/hooks/usePropertyDraftForm";
import { emptyFacilityValues } from "@features/owner-property/mappers/property-draft.mapper";
import { MultiLineFormInput } from "@elements/Form";
import { toFacilityValues } from "@features/owner-property/mappers/property-draft.mapper";
import { useTranslations } from "next-intl";
import { Checkbox } from "@elements/Form";

import type { OwnerPropertyRouteProps } from "@/types/components/modules/owner-property";
import type { FacilitiesValuesDto } from "@/types/components/modules/owner-property";

import FieldCharacterCounter from "./parts/FieldCharacterCounter";
import PropertyStepFrame from "./parts/PropertyStepFrame.client";
import isArray from "lodash/isArray";

const DESCRIPTION_MAX_LENGTH = 1024;
const CHECKBOX_GRID =
  "grid grid-cols-2 md:grid-cols-3 gap-2 border-b pb-4 w-full";
const GROUP_TITLE =
  "font-bold mb-2 col-span-full w-full text-start text-sm md:text-base text-link";

const PropertyFacilityStep = ({ propertyId }: OwnerPropertyRouteProps) => {
  const t = useTranslations();

  const { draft, isLoading, onChange, setValues, values } =
    usePropertyDraftForm(propertyId, emptyFacilityValues, {
      map: toFacilityValues,
    });
  const { isPending, submit } = useOwnerPropertyStep("facility", propertyId);

  const { data: propertyTypes } = useOwnerPropertyOptions([
    "POOL_TYPE",
    "ENTERTAINMENT",
    "KITCHEN",
    "COOL_HEAT",
    "WELFARE",
  ]);

  const onSubmit = () => {
    if (!draft?.id) return;
    submit({ ...values, propertyId: draft?.id });
  };

  const toggleOption = (
    value: string | number | null,
    key: keyof FacilitiesValuesDto,
  ) =>
    setValues((previous) => {
      const current = previous?.[key];
      if (!isArray(current)) return { ...previous, [key]: [] };
      return {
        ...previous,
        [key]: current.includes(value)
          ? current.filter((entry) => entry != value)
          : [...current, value],
      };
    });

  const optionGroup = (
    group: "COOL_HEAT" | "ENTERTAINMENT" | "KITCHEN" | "WELFARE",
    title: string,
    key: keyof FacilitiesValuesDto,
  ) => (
    <div className={CHECKBOX_GRID}>
      <p className={GROUP_TITLE}>{title}</p>
      {propertyTypes?.[group]?.map((option) => (
        <Checkbox
          title={option?.title}
          rounded="rounded-md"
          titleClass="!text-xs"
          containerClass="col-span-1"
          key={`${group}${option?.id}`}
          onSelect={() => toggleOption(option?.id, key)}
          isChecked={!!(values?.[key] as unknown[])?.includes(option?.id)}
        />
      ))}
    </div>
  );

  return (
    <PropertyStepFrame
      step="facility"
      onSubmit={onSubmit}
      isPending={isPending}
      isLoading={isLoading}
      propertyId={propertyId}
      submitTitle={t("owner.submitMoveOn")}
    >
      <div className="flex flex-col gap-2 pb-4 w-full">
        <p className="font-bold w-full text-start text-sm md:text-base text-link">
          {t("common.poolStatus")}
        </p>
        <Checkbox
          rounded="rounded-full"
          title={t("owner.poolYes")}
          isChecked={values?.has_pool}
          onSelect={() => onChange(true, "has_pool")}
        />
        <Checkbox
          rounded="rounded-full"
          title={t("owner.hasNoPool")}
          isChecked={!values?.has_pool}
          onSelect={() => onChange(false, "has_pool")}
        />
        {values?.has_pool ? (
          <MultyPopUpSelect
            value={values?.pool_type}
            title={t("common.poolType")}
            onSelect={(selected) => toggleOption(selected, "pool_type")}
            item={{ list: propertyTypes?.["POOL_TYPE"] || [] }}
          />
        ) : null}
      </div>

      {optionGroup("ENTERTAINMENT", t("common.entertainment"), "entertainment")}
      {optionGroup("KITCHEN", t("common.kitchenAcc"), "kitchen")}

      <MultiLineFormInput
        value={values?.facility_dscr || ""}
        onChangeText={(entered) => onChange(entered, "facility_dscr")}
        item={{
          containerClass: "w-full  relative col-span-full",
          extraElement: (
            <FieldCharacterCounter
              max={DESCRIPTION_MAX_LENGTH}
              value={values?.facility_dscr || ""}
            />
          ),
          maxLength: DESCRIPTION_MAX_LENGTH,
          rows: 3,
          title: t("owner.otherAccesses"),
        }}
      />

      {optionGroup("COOL_HEAT", t("common.coolHeat"), "cool_heat")}
      {optionGroup("WELFARE", t("common.welfare"), "welfare")}
    </PropertyStepFrame>
  );
};

export default PropertyFacilityStep;
