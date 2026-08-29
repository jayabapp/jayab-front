"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CreateProperyStepOne } from "@/components/properties/CreateEditProperty";
import { usePropertyDraftStep } from "@features/owner-property/hooks/usePropertyDraftStep";
import { createPropertySteps } from "@/utils/constantss";
import { useEffect, useState } from "react";
import { usePropertyDraft } from "@features/owner-property/hooks/usePropertyDraft";
import { p2e } from "@/helpers/NumberConverter";

import PropertyEditStepSkeleton from "@features/owner-property/steps/PropertyEditStepSkeleton";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import CreateEditProperty from "@/components/properties/CreateEditProperty";
import StepShower from "@/components/shared/StepShower";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

const CreateProperty = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const edit_mode = searchParams.get("edit_mode");
  const params = useParams();
  const { property_id } = params;
  const propertyId = `${property_id ?? ""}`;
  const { data: initPropData, isLoading } = usePropertyDraft(propertyId);

  const [values, setValues] = useState<CreateProperyStepOne>({
    title: "",
    property_type: "",
    construction_year: "",
    city: "",
    region: "",
    province: "",
    units_in_floor: "",
    building_area: "",
    land_area: "",
    floor_count: "",
    floor: "",
    direction: "",
    address: "",
    owenershp_type: "",
    can_chat: false,
    location_access: false,
  });

  useEffect(() => {
    if (!!initPropData) {
      setValues({
        address: initPropData.address,
        building_area: initPropData?.building_area || null,
        can_chat: initPropData?.is_chat_enabled,
        city: initPropData?.city_id,
        region: initPropData?.region_id,
        construction_year: initPropData?.construction_year,
        direction:
          initPropData?.property_options?.find(
            (e) => e?.option?.group == "BUILDING_DIRECTION",
          )?.option_id || null,
        floor: initPropData?.floor,
        floor_count: initPropData?.floors,
        land_area: initPropData?.land_area,
        location_access: initPropData?.is_location_visible,
        owenershp_type:
          initPropData?.property_options?.find(
            (e) => e?.option?.group == "OWNERSHIP",
          )?.option_id || null,
        property_type:
          initPropData?.property_options?.find(
            (e) => e?.option?.group == "PROPERTY_TYPE",
          )?.option_id || null,
        province: initPropData?.province_id,
        title: initPropData?.title,
        units_in_floor: initPropData?.unit_per_floor,
      });
    }
  }, [initPropData]);

  const onChange = (value: string | number | null | boolean, key: string) => {
    setValues((e) => ({ ...e, [key]: value }));
  };

  const { mutate, isPending } = usePropertyDraftStep(
    "initials",
    propertyId,
    () => {
      if (!!edit_mode)
        router.replace(`/profile/owner/properties/${property_id}/edit`);
      else
        router.push(`/profile/owner/properties/${property_id}/edit/location`);
    },
  );
  const onSubmit = () => {
    if (!!initPropData?.id) {
      mutate({
        address: values?.address,
        building_area: Number(p2e(values?.building_area || "")),
        building_direction: values?.direction,
        city_id: values?.city,
        region_id: values?.region,
        construction_year: Number(p2e(values?.construction_year || "")),
        floor: Number(p2e(values?.floor || "")),
        floors: Number(p2e(values?.floor_count || "")),
        is_chat_enabled: values?.can_chat,
        is_location_visible: values?.location_access,
        land_area: Number(p2e(values?.land_area || "")),
        ownership: values?.owenershp_type,
        property_type: values?.property_type,
        propertyId: initPropData?.id,
        province_id: values?.province,
        title: values?.title,
        unit_per_floor: Number(p2e(values?.units_in_floor || "")),
      });
    }
  };

  return (
    <div
      id="homeParent"
      className="profile-container  items-center  !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      <div className="w-full pb-4 px-4 pt-8">
        {" "}
        <StepShower
          steps={createPropertySteps(initPropData?.id) || []}
          value={1}
        />
      </div>

      {isLoading ? (
        <PropertyEditStepSkeleton variant="form" />
      ) : (
        <CreateEditProperty
          values={values}
          onChange={onChange}
          status={initPropData?.status}
        />
      )}

      <FixedBottomContainer>
        <Button
          loading={isPending}
          width=" w-[90%] md:w-1/2"
          roundedClass="rounded-full"
          title={_STRINGS.ENTER_AND_MOVE_ON}
          containerClass="w-full flex items-center justify-center"
          onClick={() => {
            onSubmit();
          }}
        />
      </FixedBottomContainer>
    </div>
  );
};

export default CreateProperty;
