"use client";
import { FacilitiesValuesDto, RoomInfosDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import CreateEditProperty, { CreateProperyStepOne } from "@/components/Adds/CreateEditProperty";
import CreateEditPropertyEnvInfo, { CreateProperyStepThree } from "@/components/Adds/CreateEditPropertyEnvInfo";
import TitleCounter from "@/components/Adds/TitleCounter";
import PageHeaders from "@/components/headers/PageHeader";
import Button from "@/components/shared/Button/Button";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import Checkbox from "@/components/shared/Form/Checkbox";
import Counter from "@/components/shared/Form/Counter";
import MultyPopUpSelect from "@/components/shared/Form/MultiSelectPopUpSelect";
import StepShower from "@/components/shared/StepShower";
import { p2e } from "@/helpers/NumberConverter";
import { useStoreInit } from "@/store";
import { createPropertySteps } from "@/utils/constantss";
import _STRINGS from "@/utils/LocalStrings";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isArray, remove } from "lodash";

import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CreateProperty = () => {
  const router = useRouter();
  const pathname = usePathname();

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
  });

  const [values, setValues] = useState<FacilitiesValuesDto>({
    cool_heat: [],
    entertainment: [],
    facility_dscr: "",
    has_pool: false,
    kitchen: [],
    pool_type: [],
    welfare: [],
  });

  const { data: propertyTypes } = useQuery({
    queryFn: () =>
      PropertyService.GetUserPropertyGroup({
        group: ["POOL_TYPE", "ENTERTAINMENT", "KITCHEN", "COOL_HEAT", "WELFARE"],
      }),
    queryKey: [
      PropertyService.USER_PROP_OPTIONS_CACHEKEY,
      "POOL_TYPE",
      "ENTERTAINMENT",
      "KITCHEN",
      "COOL_HEAT",
      "WELFARE",
    ],
  });

  //   useEffect(() => {
  //     if (!!userInfo) {
  //       if (!userInfo?.owner_id) {
  //         router.push(`/profile/edit?redirect_url=${pathname}`);
  //       } else {
  //         refetch();
  //       }
  //     }
  //   }, [userInfo]);

  useEffect(() => {
    if (!!initPropData) {
      //   setValues(initPropData?.bedrooms);
    }
  }, [initPropData]);

  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.CreatePropertySetBedroom,
    onSuccess: () => {
      router.push("/properties/facility");
    },
  });
  const onSubmit = () => {
    if (!!initPropData?.id) {
      //   mutate({ ...values, propertyId: initPropData?.id });
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                               ONCHANGE FUNCS                               */
  /* -------------------------------------------------------------------------- */

  const onChange = (value: boolean | string | number | null | number[], key: string) => {
    setValues((e) => ({ ...e, [key]: value }));
  };

  const onChangeMulty = (value: string | number | null, key: keyof FacilitiesValuesDto) => {
    if (isArray(values?.[key]) && values?.[key]?.includes(value)) {
      setValues((e) => ({ ...e, [key]: isArray(values?.[key]) ? values?.[key]?.filter((e) => e != value) : [] }));
    } else {
      setValues((e) => ({ ...e, [key]: isArray(values?.[key]) ? [...values?.[key], value] : [] }));
    }
  };
  console.log(propertyTypes, "propertyTypespropertyTypes");
  return (
    <div
      id="homeParent"
      className="container md:px-[25%]  items-center  !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      {/* <PageHeaders title={_STRINGS.REGISTER_PROPERTY} /> */}

      <div className="w-full pb-4 px-4 pt-8">
        <StepShower steps={createPropertySteps} value={6} />
      </div>

      <div className=" flex flex-col gap-2   pb-4 w-full">
        <p className="font-bold w-full text-start  text-sm md:text-base text-primary-700  ">{_STRINGS.POOL_STATUS}</p>
        <Checkbox
          rounded="rounded-full"
          onSelect={() => {
            onChange(true, "has_pool");
          }}
          isChecked={values?.has_pool}
          title={"استخر دارد"}
        />
        <Checkbox
          rounded="rounded-full"
          onSelect={() => {
            onChange(false, "has_pool");
          }}
          isChecked={!values?.has_pool}
          title={"استخر ندارد"}
        />

        <MultyPopUpSelect
          onSelect={(e) => {
            onChangeMulty(e, "pool_type");
          }}
          value={values?.pool_type}
          title={_STRINGS.POOL_TYPE}
          item={{ list: propertyTypes?.["POOL_TYPE"] || [] }}
        />
      </div>
      <div className=" flex flex-col gap-2  border-b pb-4 w-full">
        {" "}
        <p className="font-bold w-full text-start  text-sm md:text-base text-primary-700  ">{_STRINGS.ENTERTAINMENT}</p>
        {propertyTypes?.["ENTERTAINMENT"]?.map((e) => (
          <Checkbox
            rounded="rounded-full"
            onSelect={() => {
              onChangeMulty(e?.id, "entertainment");
            }}
            isChecked={!!values?.entertainment?.includes(e?.id)}
            title={e?.title}
          />
        ))}
      </div>
      <div className=" flex flex-col gap-2  border-b pb-4 w-full">
        <p className="font-bold w-full text-start  text-sm md:text-base text-primary-700  ">{_STRINGS.REST_ROOMS}</p>
      </div>
      <div className=" flex flex-col gap-2  border-b pb-4 w-full">
        <p className="font-bold w-full text-start  text-sm md:text-base text-primary-700  ">{_STRINGS.SHOWER}</p>
      </div>
      <FixedBottomContainer>
        <Button
          onClick={() => {
            onSubmit();
          }}
          loading={isPending}
          containerClass="w-full flex items-center justify-center"
          roundedClass="rounded-full"
          width=" w-[90%] md:w-1/2"
          title={_STRINGS.SUBMIT_MOVE_ON}
        />
      </FixedBottomContainer>
    </div>
  );
};

export default CreateProperty;
