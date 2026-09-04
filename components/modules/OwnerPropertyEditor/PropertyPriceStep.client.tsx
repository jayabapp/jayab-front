"use client";

import { useOwnerPropertyStep } from "@features/owner-property/hooks/useOwnerPropertyStep";
import { usePropertyDraftForm } from "@features/owner-property/hooks/usePropertyDraftForm";
import { emptyPriceValues } from "@features/owner-property/mappers/property-draft.mapper";
import type { OwnerPropertyRouteProps } from "@/types/components/modules/owner-property";
import type { PricingPropertySendDto } from "@/types/components/modules/owner-property";
import { toPriceValues } from "@features/owner-property/mappers/property-draft.mapper";
import { FormInputWithExternalUnit } from "@elements/Form";
import { colors } from "@/theme/colors";
import { useState } from "react";

import PropertyStepFrame from "./parts/PropertyStepFrame.client";
import numberWithCommas from "@/helpers/numberWithCommas";
import TitledCounter from "./parts/TitledCounter";
import CmsInfoPopup from "@elements/CmsInfoPopup";
import RangeWithTitle from "@elements/Slider";
import _STRINGS from "@/utils/LocalStrings";

const COMMISSION_MARKS = {
  0: { label: "0", style: { color: colors.brand[500] } },
  50: { label: "50", style: { color: colors.brand[500] } },
};

const PRICE_FIELDS: {
  key: keyof PricingPropertySendDto;
  perNight: boolean;
  title: string;
}[] = [
  { key: "normal", perNight: true, title: _STRINGS.WEEK_STARTER_DAYS_PRICE },
  { key: "wednesday", perNight: true, title: _STRINGS.WEEK_WENSDAY_PRICE },
  { key: "thursday", perNight: true, title: _STRINGS.WEEK_THURSDAY_PRICE },
  { key: "friday", perNight: true, title: _STRINGS.WEEK_FRIDAY_PRICE },
  { key: "peak", perNight: true, title: _STRINGS.WEEK_PEAK_PRICE },
  { key: "cleaning", perNight: false, title: _STRINGS.CLEANING_PRiCE },
  {
    key: "additional_person",
    perNight: true,
    title: _STRINGS.PRICE_EXTRA_PERSON,
  },
];

const PropertyPriceStep = ({ propertyId }: OwnerPropertyRouteProps) => {
  const { draft, isLoading, onChange, values } = usePropertyDraftForm(
    propertyId,
    emptyPriceValues,
    { canSeed: (saved) => !!saved?.daily_price, map: toPriceValues },
  );
  const { isEditMode, isPending, submit } = useOwnerPropertyStep(
    "price",
    propertyId,
  );

  const [dismissedNotice, setDismissedNotice] = useState(false);
  const isNoticeSuppressed =
    dismissedNotice || isEditMode || !!draft?.daily_price;
  const [showNotice, setShowNotice] = useState(false);

  const onSubmit = () => {
    if (!draft?.id) return;
    submit({ ...values, propertyId: draft?.id });
  };

  const onDigits = (entered: string, key: string) => {
    const pureValue = `${entered}`.replaceAll(",", "").replaceAll(" ", "");
    if (!isNaN(Number(pureValue))) onChange(pureValue, key);
  };

  return (
    <PropertyStepFrame
      step="price"
      isPending={isPending}
      isLoading={isLoading}
      onSubmit={onSubmit}
      propertyId={propertyId}
      submitTitle={_STRINGS.SUBMIT_MOVE_ON}
      headerClass="w-full px-4 md:px-0 pb-4 pt-8"
    >
      <div className="flex flex-col gap-2 border-b pb-4 w-full">
        <p className="font-bold w-full text-start text-sm md:text-base text-brand-600">
          {_STRINGS.GUEST_CAP}
        </p>
        <TitledCounter
          disableInput
          value={values?.std_capacity}
          title={_STRINGS.STANDARD_GUEST_CAP}
          onChange={(next) => onChange(next, "std_capacity")}
        />
        <TitledCounter
          disableInput
          value={values?.max_capacity}
          title={_STRINGS.MAX_CAPACITY}
          onChange={(next) => onChange(next, "max_capacity")}
        />
      </div>

      <div className="flex flex-col gap-2 border-b pb-8 w-full">
        <div className="w-full flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <p className="font-bold w-fit text-start text-sm md:text-base text-brand-600">
              {_STRINGS.COMITION_PERC} ( {_STRINGS.OPTIONAL} )
            </p>
            <p className="text-xs text-neutral-500 md:text-sm">
              {_STRINGS.hOW_MUCH_DO_U_WANT_TO_COMM}
            </p>
          </div>
          <p className="text-brand-600 shrink-0 text-sm">{` % ${values?.advisor_commission} `}</p>
        </div>
        <div className="flex px-4 items-center justify-center">
          <RangeWithTitle
            max={50}
            min={0}
            step={5}
            marks={COMMISSION_MARKS}
            className=" w-full md:w-1/2 "
            value={Number(values?.advisor_commission) || 0}
            setValue={(next: number) => onChange(next, "advisor_commission")}
          />
        </div>
      </div>

      <div
        className="flex flex-col gap-2 pb-4 w-full"
        onClick={() => {
          if (isNoticeSuppressed) return;
          setShowNotice(true);
        }}
      >
        <p className="font-bold w-full cursor-pointer text-start text-sm md:text-base text-brand-600">
          {_STRINGS.REND_DAYLI_PRICE}
        </p>
        {PRICE_FIELDS.map((field) => (
          <FormInputWithExternalUnit
            key={field.key}
            unit={_STRINGS.TOMAN}
            onChangeText={(entered) => onDigits(entered, field.key)}
            value={
              !field.perNight || values?.[field.key]
                ? numberWithCommas(values?.[field.key] || "")
                : ""
            }
            item={{
              containerClass: "w-full",
              convertToText: true,
              direction: "ltr",
              isMandatory: false,
              keyboard: "number",
              placeholder: field.perNight
                ? _STRINGS.TOMAN_PER_NIGHT
                : undefined,
              title: field.title,
            }}
          />
        ))}
      </div>

      <CmsInfoPopup
        show={showNotice}
        contentKey="no-reserve-commission"
        onHide={() => {
          setDismissedNotice(true);
          setShowNotice(false);
        }}
        action={{
          onClick: () => {
            setDismissedNotice(true);
            setShowNotice(false);
          },
          title: _STRINGS.UNDERSTOOD,
        }}
      />
    </PropertyStepFrame>
  );
};

export default PropertyPriceStep;
