"use client";

import { FormInputWithExternalUnit } from "@elements/Form";
import { useOwnerPropertyStep } from "@features/owner-property/hooks/useOwnerPropertyStep";
import { usePropertyDraftForm } from "@features/owner-property/hooks/usePropertyDraftForm";
import { emptyPriceValues } from "@features/owner-property/mappers/property-draft.mapper";
import { useTranslations } from "next-intl";
import { toPriceValues } from "@features/owner-property/mappers/property-draft.mapper";
import { useState } from "react";
import { colors } from "@/theme/colors";

import type { OwnerPropertyRouteProps } from "@/types/components/modules/owner-property";
import type { PricingPropertySendDto } from "@/types/components/modules/owner-property";

import PropertyStepFrame from "./parts/PropertyStepFrame.client";
import numberWithCommas from "@/helpers/numberWithCommas";
import TitledCounter from "./parts/TitledCounter";
import CmsInfoPopup from "@elements/CmsInfoPopup";
import RangeWithTitle from "@elements/Slider";

const COMMISSION_MARKS = {
  0: { label: "0", style: { color: colors.brand[500] } },
  50: { label: "50", style: { color: colors.brand[500] } },
};

const PRICE_FIELDS = [
  { key: "normal", perNight: true, title: "common.weekStarterDaysPrice" },
  { key: "wednesday", perNight: true, title: "common.weekWensdayPrice" },
  { key: "thursday", perNight: true, title: "common.weekThursdayPrice" },
  { key: "friday", perNight: true, title: "common.weekFridayPrice" },
  { key: "peak", perNight: true, title: "common.weekPeakPrice" },
  { key: "cleaning", perNight: false, title: "common.cleaningPrice" },
  {
    key: "additional_person",
    perNight: true,
    title: "owner.priceExtraPerson",
  },
] as const satisfies readonly {
  key: keyof PricingPropertySendDto;
  perNight: boolean;
  title: string;
}[];

const PropertyPriceStep = ({ propertyId }: OwnerPropertyRouteProps) => {
  const t = useTranslations();

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
      onSubmit={onSubmit}
      isPending={isPending}
      isLoading={isLoading}
      propertyId={propertyId}
      submitTitle={t("owner.submitMoveOn")}
      headerClass="w-full px-4 md:px-0 pb-4 pt-8"
    >
      <div className="flex flex-col gap-2 border-b pb-4 w-full">
        <p className="font-bold w-full text-start text-sm md:text-base text-link">
          {t("owner.guestCap")}
        </p>
        <TitledCounter
          disableInput
          value={values?.std_capacity}
          title={t("owner.standardGuestCap")}
          onChange={(next) => onChange(next, "std_capacity")}
        />
        <TitledCounter
          disableInput
          value={values?.max_capacity}
          title={t("owner.maxCapacity")}
          onChange={(next) => onChange(next, "max_capacity")}
        />
      </div>

      <div className="flex flex-col gap-2 border-b pb-8 w-full">
        <div className="w-full flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <p className="font-bold w-fit text-start text-sm md:text-base text-link">
              {t("owner.comitionPerc")} ( {t("owner.optional")} )
            </p>
            <p className="text-xs text-ink-subtle md:text-sm">
              {t("owner.howMuchDoUWantToComm")}
            </p>
          </div>
          <p className="text-link shrink-0 text-sm">{` % ${values?.advisor_commission} `}</p>
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
        <p className="font-bold w-full cursor-pointer text-start text-sm md:text-base text-link">
          {t("owner.rendDayliPrice")}
        </p>
        {PRICE_FIELDS.map((field) => (
          <FormInputWithExternalUnit
            key={field.key}
            unit={t("common.toman")}
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
                ? t("owner.tomanPerNight")
                : undefined,
              title: t(field.title),
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
          title: t("owner.understood"),
        }}
      />
    </PropertyStepFrame>
  );
};

export default PropertyPriceStep;
