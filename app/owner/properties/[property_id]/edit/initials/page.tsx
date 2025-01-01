"use client";
import { PropertyService } from "@/api_services/property/property.service";
import CreateEditProperty, { CreateProperyStepOne } from "@/components/Adds/CreateEditProperty";
import PageHeaders from "@/components/headers/PageHeader";
import Button from "@/components/shared/Button/Button";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import StepShower from "@/components/shared/StepShower";
import { p2e } from "@/helpers/NumberConverter";
import { useStoreInit } from "@/store";
import { createPropertySteps } from "@/utils/constantss";
import _STRINGS from "@/utils/LocalStrings";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CreateProperty = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { userInfo } = useStoreInit((data) => data);
  const params = useParams();
  const { property_id } = params;
  /* -------------------------------------------------------------------------- */
  /*                             INIT PROP CREATION                             */
  /* -------------------------------------------------------------------------- */
  const { data: initPropData } = useQuery({
    queryKey: [PropertyService.OWNER_PROP_INIT_CACHEKEY, property_id],
    queryFn: () => {
      if (!!property_id) {
        return PropertyService.InitProperty({ property_id: `${property_id}` });
      } else return null;
    },
    gcTime: 0,
    staleTime: 0,
  });

  const [values, setValues] = useState<CreateProperyStepOne>({
    title: "",
    property_type: "",
    construction_year: "",
    city: "",
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

  // useEffect(() => {
  //   if (!!userInfo) {
  //     if (!userInfo?.owner_id) {
  //       router.push(`/profile/edit?redirect_url=${pathname}`);
  //     } else {
  //       refetch();
  //     }
  //   }
  // }, [userInfo]);

  useEffect(() => {
    if (!!initPropData) {
      setValues({
        address: initPropData.address,
        building_area: initPropData?.building_area || null,
        can_chat: initPropData?.is_chat_enabled,
        city: initPropData?.city_id,
        construction_year: initPropData?.construction_year,
        direction:
          initPropData?.property_options?.find((e) => e?.option?.group == "BUILDING_DIRECTION")?.option_id || null,
        floor: initPropData?.floor,
        floor_count: initPropData?.floors,
        land_area: initPropData?.land_area,
        location_access: initPropData?.is_location_visible,
        owenershp_type: initPropData?.property_options?.find((e) => e?.option?.group == "OWNERSHIP")?.option_id || null,
        property_type:
          initPropData?.property_options?.find((e) => e?.option?.group == "PROPERTY_TYPE")?.option_id || null,
        province: initPropData?.province_id,
        title: initPropData?.title,
        units_in_floor: initPropData?.unit_per_floor,
      });
    }
  }, [initPropData]);

  const onChange = (value: string | number | null | boolean, key: string) => {
    setValues((e) => ({ ...e, [key]: value }));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.CreatePropertyStepOne,
    onSuccess: () => {
      router.push(`/owner/properties/${property_id}/edit/location`);
    },
  });
  const onSubmit = () => {
    if (!!initPropData?.id) {
      mutate({
        address: values?.address,
        building_area: Number(p2e(values?.building_area || "")),
        building_direction: values?.direction,
        city_id: values?.city,
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
      className="container  items-center  !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      <PageHeaders title={_STRINGS.REGISTER_PROPERTY} />

      <div className="w-full pb-4 px-4 pt-8">
        {" "}
        <StepShower steps={createPropertySteps} value={1} />
      </div>

      <CreateEditProperty onChange={onChange} values={values} />

      <FixedBottomContainer>
        <Button
          onClick={() => {
            onSubmit();
          }}
          loading={isPending}
          containerClass="w-full flex items-center justify-center"
          roundedClass="rounded-full"
          width=" w-[90%] md:w-1/2"
          title={_STRINGS.CHECK_CREDENTIOALS}
        />
      </FixedBottomContainer>
    </div>
  );
};

export default CreateProperty;
