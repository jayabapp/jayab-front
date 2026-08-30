"use client";

import { useOwnerPropertyOptions } from "@features/owner-property/hooks/useOwnerPropertyOptions";
import { emptyFacilityValues } from "@features/owner-property/mappers/property-draft.mapper";
import { useOwnerPropertyStep } from "@features/owner-property/hooks/useOwnerPropertyStep";
import { usePropertyDraftForm } from "@features/owner-property/hooks/usePropertyDraftForm";
import { toFacilityValues } from "@features/owner-property/mappers/property-draft.mapper";
import type { OwnerPropertyRouteProps } from "@/types/components/modules/owner-property";
import type { FacilitiesValuesDto } from "@/types/components/modules/owner-property";
import { MultiSelectPopUpSelect as MultyPopUpSelect } from "@elements/Form";
import { MultiLineFormInput } from "@elements/Form";
import { Checkbox } from "@elements/Form";

import FieldCharacterCounter from "./parts/FieldCharacterCounter";
import PropertyStepFrame from "./parts/PropertyStepFrame.client";
import _STRINGS from "@/utils/LocalStrings";
import isArray from "lodash/isArray";

const DESCRIPTION_MAX_LENGTH = 1024;
const CHECKBOX_GRID =
  "grid grid-cols-2 md:grid-cols-3 gap-2 border-b pb-4 w-full";
const GROUP_TITLE =
  "font-bold mb-2 col-span-full w-full text-start text-sm md:text-base text-brand-600";

const PropertyFacilityStep = ({ propertyId }: OwnerPropertyRouteProps) => {
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
      isPending={isPending}
      isLoading={isLoading}
      onSubmit={onSubmit}
      propertyId={propertyId}
      submitTitle={_STRINGS.SUBMIT_MOVE_ON}
    >
      <div className="flex flex-col gap-2 pb-4 w-full">
        <p className="font-bold w-full text-start text-sm md:text-base text-brand-600">
          {_STRINGS.POOL_STATUS}
        </p>
        <Checkbox
          rounded="rounded-full"
          title={_STRINGS.POOL_YES}
          isChecked={values?.has_pool}
          onSelect={() => onChange(true, "has_pool")}
        />
        <Checkbox
          rounded="rounded-full"
          title={_STRINGS.HAS_NO_POOL}
          isChecked={!values?.has_pool}
          onSelect={() => onChange(false, "has_pool")}
        />
        {values?.has_pool ? (
          <MultyPopUpSelect
            value={values?.pool_type}
            title={_STRINGS.POOL_TYPE}
            onSelect={(selected) => toggleOption(selected, "pool_type")}
            item={{ list: propertyTypes?.["POOL_TYPE"] || [] }}
          />
        ) : null}
      </div>

      {optionGroup("ENTERTAINMENT", _STRINGS.ENTERTAINMENT, "entertainment")}
      {optionGroup("KITCHEN", _STRINGS.KITCHEN_ACC, "kitchen")}

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
          title: _STRINGS.OTHER_ACCESSES,
        }}
      />

      {optionGroup("COOL_HEAT", _STRINGS.COOL_HEAT, "cool_heat")}
      {optionGroup("WELFARE", _STRINGS.WELFARE, "welfare")}
    </PropertyStepFrame>
  );
};

export default PropertyFacilityStep;
