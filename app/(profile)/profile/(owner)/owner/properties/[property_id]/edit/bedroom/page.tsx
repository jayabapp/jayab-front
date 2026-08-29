"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { usePropertyDraftStep } from "@features/owner-property/hooks/usePropertyDraftStep";
import { createPropertySteps } from "@/utils/constantss";
import { useEffect, useState } from "react";
import { usePropertyDraft } from "@features/owner-property/hooks/usePropertyDraft";
import { RoomInfosDto } from "@/api_services/property/property.interface";

import PropertyEditStepSkeleton from "@features/owner-property/steps/PropertyEditStepSkeleton";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import TitleCounter from "@/components/properties/TitleCounter";
import StepShower from "@/components/shared/StepShower";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

const CreateProperty = () => {
  const searchParams = useSearchParams();
  const edit_mode = searchParams.get("edit_mode");
  const router = useRouter();
  const params = useParams();
  const { property_id } = params;

  const propertyId = `${property_id ?? ""}`;
  const { data: initPropData, isLoading } = usePropertyDraft(propertyId);

  const [values, setValues] = useState<RoomInfosDto>({
    bedrooms: [],
    additional_bed: 0,
    master_room: 0,
    sofa_bed: 0,
    wc: 0,
    wc_ir: 0,
    bathroom_master: 0,
    bathroom_general: 0,
    bathroom_in_wc: 0,
    bathroom_tub: 0,
  });

  useEffect(() => {
    if (!!initPropData) {
      const defaultData = initPropData?.bedrooms;
      setValues({
        additional_bed: defaultData?.additional_bed || 0,
        bathroom_general: defaultData?.bathroom_general || 0,
        bathroom_in_wc: defaultData?.bathroom_in_wc || 0,
        bathroom_master: defaultData?.bathroom_master || 0,
        bathroom_tub: defaultData?.bathroom_tub || 0,
        bedrooms: defaultData?.bedrooms || [],
        master_room: defaultData?.master_room || 0,
        sofa_bed: defaultData?.sofa_bed || 0,
        wc: defaultData?.wc || 0,
        wc_ir: defaultData?.wc_ir || 0,
      });
    }
  }, [initPropData]);

  const { mutate, isPending } = usePropertyDraftStep(
    "bedroom",
    propertyId,
    () => {
      if (!!edit_mode)
        router.replace(`/profile/owner/properties/${property_id}/edit`);
      else
        router.push(`/profile/owner/properties/${property_id}/edit/facility`);
    },
  );
  const onSubmit = () => {
    if (!!initPropData?.id) mutate({ ...values, propertyId: initPropData?.id });
  };

  const onChange = (value: string | number | null | number[], key: string) => {
    setValues((e) => ({ ...e, [key]: value }));
  };

  const addRemoveRoom = (e: number) => {
    const length = values?.bedrooms?.length;
    if (e > length) onChange([...values?.bedrooms, 0], "bedrooms");
    else
      onChange(
        values?.bedrooms?.filter(
          (e, index) => index != values?.bedrooms?.length - 1,
        ),
        "bedrooms",
      );
  };
  const updateRoom = (e: number, index: number) => {
    onChange(
      values.bedrooms.map((room, roomIndex) =>
        roomIndex === index ? e : room,
      ),
      "bedrooms",
    );
  };

  return (
    <div
      id="homeParent"
      className="profile-container md:px-[5%]  items-center  !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      <div className="w-full pb-4 px-4 pt-8">
        <StepShower steps={createPropertySteps(initPropData?.id)} value={5} />
      </div>
      {isLoading ? (
        <PropertyEditStepSkeleton variant="form" />
      ) : (
        <>
          {" "}
          <p className="font-bold w-full text-start  text-sm md:text-base text-brand-600  ">
            {_STRINGS.ROOMS_INFO}
          </p>
          <div className=" flex flex-col gap-2  border-b pb-4 w-full">
            {" "}
            <TitleCounter
              disableInput={true}
              value={values?.bedrooms?.length}
              onChange={(e) => {
                addRemoveRoom(e);
              }}
              title="تعداد اتاق"
            />
            {values?.bedrooms?.map((e, index) => (
              <TitleCounter
                key={`${index + 1}room`}
                value={e}
                onChange={(e) => {
                  updateRoom(e, index);
                }}
                title={`تعداد تخت اتاق ${index + 1}`}
              />
            ))}
          </div>
          <div className=" flex flex-col gap-2  border-b pb-4 w-full">
            <TitleCounter
              disableInput={true}
              value={values?.additional_bed}
              onChange={(e) => {
                onChange(e, "additional_bed");
              }}
              title="رخت خواب اضافه"
            />
            <TitleCounter
              disableInput={true}
              value={values?.master_room}
              onChange={(e) => {
                onChange(e, "master_room");
              }}
              title="اتاق خواب مستر"
            />
            <TitleCounter
              disableInput={true}
              value={values?.sofa_bed}
              onChange={(e) => {
                onChange(e, "sofa_bed");
              }}
              title="مبل تخت خواب شو"
            />
          </div>
          <div className=" flex flex-col gap-2  border-b pb-4 w-full">
            <p className="font-bold w-full text-start  text-sm md:text-base text-brand-600  ">
              {_STRINGS.REST_ROOMS}
            </p>
            <TitleCounter
              disableInput={true}
              value={values?.wc}
              onChange={(e) => {
                onChange(e, "wc");
              }}
              title="سرویس بهداشتی فرنگی"
            />
            <TitleCounter
              disableInput={true}
              value={values?.wc_ir}
              onChange={(e) => {
                onChange(e, "wc_ir");
              }}
              title="سرویس بهداشتی ایرانی"
            />
          </div>
          <div className=" flex flex-col gap-2  border-b pb-4 w-full">
            <p className="font-bold w-full text-start  text-sm md:text-base text-brand-600  ">
              {_STRINGS.SHOWER}
            </p>
            <TitleCounter
              disableInput={true}
              value={values?.bathroom_master}
              onChange={(e) => {
                onChange(e, "bathroom_master");
              }}
              title="حمام شخصی داخل اتاق"
            />
            <TitleCounter
              disableInput={true}
              value={values?.bathroom_general}
              onChange={(e) => {
                onChange(e, "bathroom_general");
              }}
              title="حمام مشترک"
            />
            <TitleCounter
              disableInput={true}
              value={values?.bathroom_in_wc}
              onChange={(e) => {
                onChange(e, "bathroom_in_wc");
              }}
              title="حمام در سرویس"
            />
            <TitleCounter
              disableInput={true}
              value={values?.bathroom_tub}
              onChange={(e) => {
                onChange(e, "bathroom_tub");
              }}
              title="حمام وان دار"
            />
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

export default CreateProperty;
