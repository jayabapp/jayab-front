"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useRouter, useSearchParams } from "next/navigation";
import { useOwnerPropertyOptions } from "@features/owner-property/hooks/useOwnerPropertyOptions";
import { usePropertyDraftStep } from "@features/owner-property/hooks/usePropertyDraftStep";
import { FacilitiesValuesDto } from "@/api_services/property/property.interface";
import { createPropertySteps } from "@/utils/constantss";
import { useEffect, useState } from "react";
import { usePropertyDraft } from "@features/owner-property/hooks/usePropertyDraft";
import { useParams } from "next/navigation";

import PropertyEditStepSkeleton from "@features/owner-property/steps/PropertyEditStepSkeleton";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import MultiLineFormInput from "@/components/shared/Form/MultiLineFormInput";
import MultyPopUpSelect from "@/components/shared/Form/MultiSelectPopUpSelect";
import FormCounter from "@/components/properties/FormCounter";
import StepShower from "@/components/shared/StepShower";
import Checkbox from "@/components/shared/Form/Checkbox";
import _STRINGS from "@/utils/LocalStrings";
import isArray from "lodash/isArray";
import Button from "@/components/shared/Button/Button";

const CreatePropertyFacility = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const edit_mode = searchParams.get("edit_mode");
  const params = useParams();
  const { property_id } = params;

  const propertyId = `${property_id ?? ""}`;
  const { data: initPropData, isLoading } = usePropertyDraft(propertyId);

  const [values, setValues] = useState<FacilitiesValuesDto>({
    cool_heat: [],
    entertainment: [],
    facility_dscr: "",
    has_pool: false,
    kitchen: [],
    pool_type: [],
    welfare: [],
  });

  const { data: propertyTypes } = useOwnerPropertyOptions([
    "POOL_TYPE",
    "ENTERTAINMENT",
    "KITCHEN",
    "COOL_HEAT",
    "WELFARE",
  ]);

  useEffect(() => {
    if (!!initPropData) {
      setValues({
        welfare:
          initPropData?.property_options
            ?.filter((e) => e?.option?.group == "WELFARE")
            ?.map((e) => e?.option_id) || [],
        cool_heat:
          initPropData?.property_options
            ?.filter((e) => e?.option?.group == "COOL_HEAT")
            ?.map((e) => e?.option_id) || [],
        entertainment:
          initPropData?.property_options
            ?.filter((e) => e?.option?.group == "ENTERTAINMENT")
            ?.map((e) => e?.option_id) || [],
        pool_type:
          initPropData?.property_options
            ?.filter((e) => e?.option?.group == "POOL_TYPE")
            ?.map((e) => e?.option_id) || [],
        kitchen:
          initPropData?.property_options
            ?.filter((e) => e?.option?.group == "KITCHEN")
            ?.map((e) => e?.option_id) || [],
        facility_dscr: initPropData?.description?.facility_dscr,
        has_pool: initPropData?.has_pool,
      });
    }
  }, [initPropData]);

  const { mutate, isPending } = usePropertyDraftStep(
    "facility",
    propertyId,
    () => {
      if (!!edit_mode)
        router.replace(`/profile/owner/properties/${property_id}/edit`);
      else router.push(`/profile/owner/properties/${property_id}/edit/price`);
    },
  );
  const onSubmit = () => {
    if (!!initPropData?.id) mutate({ ...values, propertyId: initPropData?.id });
  };

  const onChange = (
    value: boolean | string | number | null | number[],
    key: string,
  ) => {
    setValues((e) => ({ ...e, [key]: value }));
  };

  const onChangeMulty = (
    value: string | number | null,
    key: keyof FacilitiesValuesDto,
  ) => {
    if (isArray(values?.[key]) && values?.[key]?.includes(value)) {
      setValues((e) => ({
        ...e,
        [key]: isArray(values?.[key])
          ? values?.[key]?.filter((e) => e != value)
          : [],
      }));
    } else {
      setValues((e) => ({
        ...e,
        [key]: isArray(values?.[key]) ? [...values?.[key], value] : [],
      }));
    }
  };
  return (
    <div
      id="homeParent"
      className=" profile-container md:px-[5%]  items-center  !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      <div className="w-full pb-4 px-4 pt-8">
        <StepShower steps={createPropertySteps(initPropData?.id)} value={6} />
      </div>

      {isLoading ? (
        <PropertyEditStepSkeleton variant="form" />
      ) : (
        <>
          {" "}
          <div className=" flex flex-col gap-2   pb-4 w-full">
            <p className="font-bold w-full text-start  text-sm md:text-base text-brand-600  ">
              {_STRINGS.POOL_STATUS}
            </p>
            <Checkbox
              title={"استخر دارد"}
              rounded="rounded-full"
              isChecked={values?.has_pool}
              onSelect={() => {
                onChange(true, "has_pool");
              }}
            />
            <Checkbox
              title={"استخر ندارد"}
              rounded="rounded-full"
              isChecked={!values?.has_pool}
              onSelect={() => {
                onChange(false, "has_pool");
              }}
            />

            {!!values?.has_pool ? (
              <MultyPopUpSelect
                onSelect={(e) => {
                  onChangeMulty(e, "pool_type");
                }}
                value={values?.pool_type}
                title={_STRINGS.POOL_TYPE}
                item={{ list: propertyTypes?.["POOL_TYPE"] || [] }}
              />
            ) : (
              <></>
            )}
          </div>
          <div className="  grid   grid-cols-2 md:grid-cols-3 gap-2  border-b pb-4 w-full">
            {" "}
            <p className="font-bold mb-2  col-span-full w-full text-start  text-sm md:text-base text-brand-600  ">
              {_STRINGS.ENTERTAINMENT}
            </p>
            {propertyTypes?.["ENTERTAINMENT"]?.map((e, index) => (
              <Checkbox
                key={`Emt${e?.id}`}
                rounded="rounded-md"
                onSelect={() => {
                  onChangeMulty(e?.id, "entertainment");
                }}
                titleClass="  !text-xs  "
                containerClass={` ${(index + 1) % 2 == 0 ? "col-span-1" : "col-span-1"}`}
                isChecked={!!values?.entertainment?.includes(e?.id)}
                title={e?.title}
              />
            ))}
          </div>
          <div className=" grid   grid-cols-2 md:grid-cols-3  gap-2  border-b pb-4 w-full">
            <p className="font-bold mb-2 col-span-full w-full text-start  text-sm md:text-base text-brand-600  ">
              {_STRINGS.KITCHEN_ACC}
            </p>
            {propertyTypes?.["KITCHEN"]?.map((e, index) => (
              <Checkbox
                title={e?.title}
                rounded="rounded-md"
                key={`KITCHEN${e?.id}`}
                titleClass="!text-xs"
                isChecked={!!values?.kitchen?.includes(e?.id)}
                containerClass={` ${(index + 1) % 2 == 0 ? `col-span-1` : "col-span-1"}`}
                onSelect={() => {
                  onChangeMulty(e?.id, "kitchen");
                }}
              />
            ))}
          </div>
          <MultiLineFormInput
            item={{
              title: _STRINGS.OTHER_ACCESSES,
              containerClass: "w-full  relative col-span-full",
              extraElement: (
                <FormCounter max={1024} value={values?.facility_dscr || ""} />
              ),
              rows: 3,
              maxLength: 1024,
            }}
            value={values?.facility_dscr || ""}
            onChangeText={(e) => {
              onChange(e, "facility_dscr");
            }}
          />
          <div className="  grid   grid-cols-2 md:grid-cols-3   gap-2  border-b pb-4 w-full">
            <p className="font-bold  w-full mb-2 col-span-full  text-start  text-sm md:text-base text-brand-600  ">
              {_STRINGS.COOL_HEAT}
            </p>
            {propertyTypes?.["COOL_HEAT"]?.map((e, index) => (
              <Checkbox
                title={e?.title}
                rounded="rounded-md"
                titleClass="!text-xs"
                key={`COOL_HEAT${e?.id}`}
                isChecked={!!values?.cool_heat?.includes(e?.id)}
                containerClass={` ${(index + 1) % 2 == 0 ? `col-span-1` : "col-span-1"}`}
                onSelect={() => {
                  onChangeMulty(e?.id, "cool_heat");
                }}
              />
            ))}{" "}
          </div>
          <div className=" grid   grid-cols-2 md:grid-cols-3  gap-2  border-b pb-4 w-full">
            <p className="font-bold col-span-full w-full mb-2 text-start  text-sm md:text-base text-brand-600  ">
              {_STRINGS.WELFARE}
            </p>
            {propertyTypes?.["WELFARE"]?.map((e, index) => (
              <Checkbox
                title={e?.title}
                rounded="rounded-md"
                titleClass="!text-xs"
                key={`WELFARE${e?.id}`}
                isChecked={!!values?.welfare?.includes(e?.id)}
                containerClass={` ${(index + 1) % 2 == 0 ? `col-span-1` : "col-span-1"}`}
                onSelect={() => {
                  onChangeMulty(e?.id, "welfare");
                }}
              />
            ))}{" "}
          </div>
        </>
      )}
      <FixedBottomContainer>
        <Button
          loading={isPending}
          width=" w-[90%] md:w-1/2"
          roundedClass="rounded-full"
          title={_STRINGS.SUBMIT_MOVE_ON}
          containerClass="w-full flex items-center justify-center"
          onClick={() => {
            onSubmit();
          }}
        />
      </FixedBottomContainer>
    </div>
  );
};

export default CreatePropertyFacility;
