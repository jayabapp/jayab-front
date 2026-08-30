"use client";

import { emptyInitialsValues } from "@features/owner-property/mappers/property-draft.mapper";
import { useOwnerPropertyStep } from "@features/owner-property/hooks/useOwnerPropertyStep";
import { usePropertyDraftForm } from "@features/owner-property/hooks/usePropertyDraftForm";
import { toInitialsValues } from "@features/owner-property/mappers/property-draft.mapper";
import type { OwnerPropertyRouteProps } from "@/types/components/modules/owner-property";
import { p2e } from "@/helpers/NumberConverter";

import PropertyInitialsFields from "./parts/PropertyInitialsFields.client";
import PropertyStepFrame from "./parts/PropertyStepFrame.client";
import _STRINGS from "@/utils/LocalStrings";

const asNumber = (value: string | number | null) =>
  Number(p2e(`${value || ""}`));

const PropertyInitialsStep = ({ propertyId }: OwnerPropertyRouteProps) => {
  const { draft, isLoading, onChange, values } = usePropertyDraftForm(
    propertyId,
    emptyInitialsValues,
    { map: toInitialsValues },
  );
  const { isPending, submit } = useOwnerPropertyStep("initials", propertyId);

  const onSubmit = () => {
    if (!draft?.id) return;
    submit({
      address: values?.address,
      building_area: asNumber(values?.building_area),
      building_direction: values?.direction,
      city_id: values?.city,
      construction_year: asNumber(values?.construction_year),
      floor: asNumber(values?.floor),
      floors: asNumber(values?.floor_count),
      is_chat_enabled: values?.can_chat,
      is_location_visible: values?.location_access,
      land_area: asNumber(values?.land_area),
      ownership: values?.owenershp_type,
      property_type: values?.property_type,
      propertyId: draft?.id,
      province_id: values?.province,
      region_id: values?.region,
      title: values?.title,
      unit_per_floor: asNumber(values?.units_in_floor),
    });
  };

  return (
    <PropertyStepFrame
      step="initials"
      isPending={isPending}
      isLoading={isLoading}
      onSubmit={onSubmit}
      propertyId={propertyId}
      submitTitle={_STRINGS.ENTER_AND_MOVE_ON}
    >
      <PropertyInitialsFields
        values={values}
        onChange={onChange}
        status={draft?.status}
      />
    </PropertyStepFrame>
  );
};

export default PropertyInitialsStep;
