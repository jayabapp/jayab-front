"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PricingPropertySendDto } from "@/api_services/property/property.interface";
import { useEffect, useState } from "react";
import { GC_TIME, STALE_TIME } from "@/helpers/queryCache";
import { createPropertySteps } from "@/utils/constantss";
import { PropertyService } from "@/api_services/property/property.service";

import FormInputWithExternalUnit from "@/components/shared/Form/FormInputWithExternalUnit";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import numberWithCommas from "@/helpers/numberWithCommas";
import RangeWithTitle from "@/components/shared/Form/RangeWithTitle";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import CmsInfoPopup from "@/components/shared/CmsInfoPopup";
import TitleCounter from "@/components/properties/TitleCounter";
import StepShower from "@/components/shared/StepShower";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@/components/shared/Button/Button";

const CreatePropertyPricing = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const edit_mode = searchParams.get("edit_mode");
  const params = useParams();
  const { property_id } = params;

  const { data: initPropData, isLoading } = useQuery({
    queryKey: [PropertyService.OWNER_PROP_INIT_CACHEKEY, property_id],
    queryFn: () => {
      if (!!property_id)
        return PropertyService.InitProperty({ property_id: `${property_id}` });
      else return null;
    },
    staleTime: STALE_TIME.MEDIUM,
    gcTime: GC_TIME.LONG,
  });

  useEffect(() => {
    if (!!initPropData?.daily_price) {
      setPreventer(true);
      setValues({
        additional_person: initPropData?.daily_price?.additional_person || 0,
        advisor_commission: initPropData?.advisor_commission || 0,
        cleaning: initPropData?.daily_price?.cleaning || 0,
        friday: initPropData?.daily_price?.friday || 0,
        max_capacity: initPropData?.max_capacity || 0,
        normal: initPropData?.daily_price?.normal || 0,
        peak: initPropData?.daily_price?.peak || 0,
        std_capacity: initPropData?.std_capacity || 0,
        thursday: initPropData?.daily_price?.thursday || 0,
        wednesday: initPropData?.daily_price?.wednesday,
      });
    }
  }, [initPropData]);

  const [values, setValues] = useState<PricingPropertySendDto>({
    additional_person: "",
    advisor_commission: 0,
    cleaning: "",
    friday: "",
    max_capacity: 0,
    normal: "",
    peak: "",
    std_capacity: 0,
    thursday: "",
    wednesday: "",
  });

  const onChange = (value: string | number | null | number[], key: string) => {
    setValues((e) => ({ ...e, [key]: value }));
  };

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.CreatePropertySetPrice,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PropertyService.OWNER_PROP_INIT_CACHEKEY, property_id],
      });
      if (!!!!edit_mode)
        router.replace(`/profile/owner/properties/${property_id}/edit`);
      else
        router.push(`/profile/owner/properties/${property_id}/edit/assistants`);
    },
  });
  const onSubmit = () => {
    if (!!initPropData?.id) mutate({ ...values, propertyId: initPropData?.id });
  };

  const [showNotifyPop, setShowNotifyPop] = useState(false);
  const [preventer, setPreventer] = useState(false);

  const onHideNotify = () => {
    setPreventer(true);
    setShowNotifyPop(false);
  };

  const onShowNotify = () => {
    if (!!preventer) return;
    setShowNotifyPop(true);
  };

  useEffect(() => {
    if (!edit_mode) return;
    setPreventer(true);
  }, [edit_mode]);

  return (
    <div
      id="homeParent"
      className=" profile-container   items-center   transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      <div className="w-full px-4 md:px-0 pb-4 pt-8">
        {" "}
        <StepShower steps={createPropertySteps(initPropData?.id)} value={7} />
      </div>
      {isLoading ? (
        <LottieLoading />
      ) : (
        <>
          {" "}
          <div className=" flex flex-col gap-2 border-b   pb-4 w-full">
            <p className="font-bold w-full text-start  text-sm md:text-base text-primary-700  ">
              {_STRINGS.GUEST_CAP}
            </p>
            <TitleCounter
              disableInput={true}
              value={values?.std_capacity}
              title="ظرفیت استاندارد میهمان"
              onChange={(e) => {
                onChange(e, "std_capacity");
              }}
            />
            <TitleCounter
              disableInput={true}
              title="حداکثر ظرفیت میهمان"
              value={values?.max_capacity}
              onChange={(e) => {
                onChange(e, "max_capacity");
              }}
            />
          </div>
          <div className=" flex flex-col gap-2 border-b   pb-8 w-full">
            <div className="w-full flex items-start justify-between ">
              {" "}
              <div className="flex flex-col gap-2">
                <p className="font-bold w-fit text-start  text-sm md:text-base text-primary-700  ">
                  {_STRINGS.COMITION_PERC} ( اختیاری )
                </p>
                <p className=" text-xs text-primary-800 md:text-sm">
                  {_STRINGS.hOW_MUCH_DO_U_WANT_TO_COMM}
                </p>
              </div>
              <p className="text-primary-700  shrink-0 text-sm">{` % ${values?.advisor_commission} `}</p>
            </div>
            <div className="flex px-4 items-center justify-center">
              {" "}
              <RangeWithTitle
                className=" w-full md:w-1/2 "
                marks={{
                  0: { label: "0", style: { color: "#3886E5" } },
                  50: { label: "50", style: { color: "#3886E5" } },
                }}
                max={50}
                min={0}
                step={5}
                setValue={(e: any) => {
                  onChange(e, "advisor_commission");
                }}
                value={Number(values?.advisor_commission) || 0}
              />
            </div>
          </div>
          <div
            onClick={onShowNotify}
            className=" flex flex-col gap-2    pb-4 w-full"
          >
            <p className="font-bold w-full text-start  text-sm md:text-base text-primary-700  ">
              {_STRINGS.REND_DAYLI_PRICE}
            </p>{" "}
            <FormInputWithExternalUnit
              unit={_STRINGS.TOMAN}
              item={{
                title: "قیمت شنبه تا سه شنبه",
                isMandatory: false,
                containerClass: "w-full",
                keyboard: "number",
                convertToText: true,
                direction: "ltr",
                placeholder: _STRINGS.TOMAN_PER_NIGHT,
              }}
              value={
                !!values?.normal
                  ? numberWithCommas(values?.normal || "") || ""
                  : ""
              }
              onChangeText={(e) => {
                let pureVal = e
                  ?.replaceAll(",", "")
                  .replaceAll(",", "")
                  .replaceAll(" ", "");

                if (!isNaN(pureVal)) onChange(pureVal, "normal");
              }}
            />
            <FormInputWithExternalUnit
              unit={_STRINGS.TOMAN}
              item={{
                title: "قیمت چهارشنبه",
                isMandatory: false,
                containerClass: "w-full",
                keyboard: "number",
                convertToText: true,
                direction: "ltr",
                placeholder: _STRINGS.TOMAN_PER_NIGHT,
              }}
              value={
                !!values?.wednesday
                  ? numberWithCommas(values?.wednesday || "")
                  : ""
              }
              onChangeText={(e) => {
                let pureVal = e
                  ?.replaceAll(",", "")
                  .replaceAll(",", "")
                  .replaceAll(" ", "");
                if (!isNaN(pureVal)) onChange(pureVal, "wednesday");
              }}
            />
            <FormInputWithExternalUnit
              unit={_STRINGS.TOMAN}
              item={{
                title: "قیمت پنجشنبه",
                isMandatory: false,
                containerClass: "w-full",
                keyboard: "number",
                convertToText: true,
                direction: "ltr",
                placeholder: _STRINGS.TOMAN_PER_NIGHT,
              }}
              value={
                !!values?.thursday
                  ? numberWithCommas(values?.thursday || "")
                  : ""
              }
              onChangeText={(e) => {
                let pureVal = e
                  ?.replaceAll(",", "")
                  .replaceAll(",", "")
                  .replaceAll(" ", "");
                if (!isNaN(pureVal)) onChange(pureVal, "thursday");
              }}
            />
            <FormInputWithExternalUnit
              unit={_STRINGS.TOMAN}
              item={{
                title: "قیمت جمعه",
                isMandatory: false,
                containerClass: "w-full",
                keyboard: "number",
                convertToText: true,
                direction: "ltr",
                placeholder: _STRINGS.TOMAN_PER_NIGHT,
              }}
              value={
                !!values?.friday ? numberWithCommas(values?.friday || "") : ""
              }
              onChangeText={(e) => {
                let pureVal = e
                  ?.replaceAll(",", "")
                  .replaceAll(",", "")
                  .replaceAll(" ", "");

                if (!isNaN(pureVal)) onChange(pureVal, "friday");
              }}
            />
            <FormInputWithExternalUnit
              unit={_STRINGS.TOMAN}
              item={{
                title: "قیمت ایام پیک",
                isMandatory: false,
                containerClass: "w-full",
                keyboard: "number",
                convertToText: true,
                direction: "ltr",
                placeholder: _STRINGS.TOMAN_PER_NIGHT,
              }}
              value={!!values?.peak ? numberWithCommas(values?.peak || "") : ""}
              onChangeText={(e) => {
                let pureVal = e
                  ?.replaceAll(",", "")
                  .replaceAll(",", "")
                  .replaceAll(" ", "");
                if (!isNaN(pureVal)) onChange(pureVal, "peak");
              }}
            />
            <FormInputWithExternalUnit
              unit={_STRINGS.TOMAN}
              item={{
                title: "هزینه نظافت",
                isMandatory: false,
                containerClass: "w-full",
                keyboard: "number",
                convertToText: true,
                direction: "ltr",
              }}
              value={numberWithCommas(values?.cleaning || "")}
              onChangeText={(e) => {
                let pureVal = e
                  ?.replaceAll(",", "")
                  .replaceAll(",", "")
                  .replaceAll(" ", "");
                if (!isNaN(pureVal)) onChange(pureVal, "cleaning");
              }}
            />
            <FormInputWithExternalUnit
              unit={_STRINGS.TOMAN}
              item={{
                title: "قیمت نفر اضافه و سه سال به بالا",
                isMandatory: false,
                containerClass: "w-full",
                keyboard: "number",
                convertToText: true,
                direction: "ltr",
                placeholder: _STRINGS.TOMAN_PER_NIGHT,
              }}
              value={
                !!values?.additional_person
                  ? numberWithCommas(values?.additional_person || "")
                  : ""
              }
              onChangeText={(e) => {
                let pureVal = e
                  ?.replaceAll(",", "")
                  .replaceAll(",", "")
                  .replaceAll(" ", "");
                if (!isNaN(pureVal)) onChange(pureVal, "additional_person");
              }}
            />
          </div>
        </>
      )}

      <FixedBottomContainer>
        <Button
          onClick={() => {
            onSubmit();
          }}
          loading={isPending}
          width=" w-[90%] md:w-1/2"
          roundedClass="rounded-full"
          title={_STRINGS.SUBMIT_MOVE_ON}
          containerClass="w-full flex items-center justify-center"
        />
      </FixedBottomContainer>

      <CmsInfoPopup
        show={showNotifyPop}
        onHide={onHideNotify}
        contentKey="no-reserve-commission"
        action={{ title: _STRINGS.UNDERSTOOD, onClick: onHideNotify }}
      />
    </div>
  );
};

export default CreatePropertyPricing;
