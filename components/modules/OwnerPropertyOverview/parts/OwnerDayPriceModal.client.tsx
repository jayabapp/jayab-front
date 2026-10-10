"use client";

import { useOwnerPriceLimits } from "@features/owner-property/hooks/useOwnerPriceLimits";
import { useUpdateDayPrice } from "@features/owner-property/hooks/useUpdateDayPrice";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toJalaaliDays } from "@features/owner-property/lib/calendar-cache";
import { ContentImage } from "@elements/Image";
import { Checkbox } from "@elements/Form";
import { Divider } from "@elements/Divider";

import type { OwnerDayPriceModalProps } from "@/types/components/modules/owner-property";

import SkeletonText from "@elements/Skeleton/SkeletonText";
import OwnerPriceRangeField from "./OwnerPriceRangeField";
import useCmsContent from "@/hooks/useCmsContent";
import CmsText from "@elements/CmsText";
import Button from "@elements/Button";
import Notify from "@elements/Toast";
import Modal from "@elements/Modal";

const MAX_PROPERTY_PRICE = 1000000000;
const DEFAULT_SLIDER_MAX = 20000000;
const DEFAULT_STEP = 100000;

const OwnerDayPriceModal = ({
  show,
  onHide,
  property,
  selectedDates,
  selectedDaysData,
}: OwnerDayPriceModalProps) => {
  const t = useTranslations();

  const selectedDays = useMemo(
    () => toJalaaliDays(selectedDates),
    [selectedDates],
  );
  const firstDay = selectedDays[0];
  const firstDayData = selectedDaysData[0];

  const { data: priceLimits } = useOwnerPriceLimits(
    property?.id ?? "",
    firstDay?.day ?? "",
    firstDay?.month ?? "",
    firstDay?.year ?? "",
  );

  const step = priceLimits?.step || DEFAULT_STEP;
  const minPrice = priceLimits?.min_price || 0;

  const seedKey = `${firstDayData?.year ?? ""}/${firstDayData?.month ?? ""}/${firstDayData?.day ?? ""}`;
  const [draft, setDraft] = useState({
    ceiling: 0,
    discount: 0,
    hasDiscount: false,
    key: "",
    price: 0,
  });

  let current = draft;
  if (current.key !== seedKey) {
    const price = firstDayData?.price || 0;
    const discount = firstDayData?.discounted_price || 0;
    current = {
      ceiling: Math.max(price, discount),
      discount,
      hasDiscount: !!discount,
      key: seedKey,
      price,
    };
  }
  if (current !== draft) setDraft(current);

  const sliderCeiling = useMemo(() => {
    const base = priceLimits?.base_price
      ? priceLimits.base_price * 2
      : DEFAULT_SLIDER_MAX;
    return Math.ceil(Math.max(base, current.ceiling) / step) * step;
  }, [priceLimits, current.ceiling, step]);

  const applyPrice = (value: number, key: "discount" | "price") => {
    const next = Math.min(value, MAX_PROPERTY_PRICE);
    setDraft((previous) => ({
      ...previous,
      [key]: next,
      ceiling: Math.max(previous.ceiling, next),
    }));
  };

  const { mutate, isPending } = useUpdateDayPrice(property?.id ?? "");

  const onSubmit = () => {
    if (isPending) return;
    if (current.hasDiscount && current.discount >= current.price) {
      Notify({ body: t("owner.discountBiggerThanPrice"), type: "warn" });
      return;
    }
    mutate(
      {
        days: selectedDays,
        discounted_price:
          current.hasDiscount && !!current.discount
            ? current.discount
            : undefined,
        price: current.price,
        property_id: property?.id,
      },
      { onSuccess: onHide },
    );
  };

  const { content: fastPriceChangeMessage, isLoading } = useCmsContent(
    "fastPriceChangeMessage",
    { enabled: !!show },
  );
  const { content: discountPriceMessage, isLoading: isDiscountLoading } =
    useCmsContent("discountPriceMessage", { enabled: !!show });

  const selectedDaysTitle =
    selectedDays.length > 1
      ? `${t("owner.selectedDays", { count: Number(selectedDays.length) })}`
      : selectedDates[0] || "";

  return (
    <Modal show={show} onHide={onHide}>
      <div className="flex flex-col gap-4 p-4 bg-white rounded-20">
        <ContentImage
          alt=""
          width={36}
          height={36}
          className="w-9 h-9 aspect-square"
          src="/assets/icons/property/price_label.svg"
        />
        <p className="text-sm font-bold text-brand-600">
          {t("owner.immediateChange")}
        </p>
        {isLoading ? (
          <SkeletonText lines={3} />
        ) : (
          <CmsText className="text-xs">
            {fastPriceChangeMessage?.small_text || ""}
          </CmsText>
        )}

        <OwnerPriceRangeField
          step={step}
          min={minPrice}
          max={sliderCeiling}
          value={current.price}
          setValue={(value) => applyPrice(value, "price")}
          title={`${t("common.price")} ${selectedDaysTitle}`}
        />

        <Divider moreClass="w-full " />

        <ContentImage
          alt=""
          width={36}
          height={36}
          className="w-9 h-9 aspect-square"
          src="/assets/icons/property/discount_label.svg"
        />
        <p className="text-sm font-bold text-brand-600">
          {t("owner.discountedPriceTitle")}
        </p>
        {isDiscountLoading ? (
          <SkeletonText lines={3} />
        ) : (
          <CmsText className="text-xs">
            {discountPriceMessage?.small_text || ""}
          </CmsText>
        )}

        <Checkbox
          isChecked={current.hasDiscount}
          title={t("owner.applyDiscount")}
          onSelect={() =>
            setDraft((previous) => ({
              ...previous,
              hasDiscount: !previous.hasDiscount,
            }))
          }
        />
        {current.hasDiscount ? (
          <OwnerPriceRangeField
            step={step}
            min={minPrice}
            max={sliderCeiling}
            value={current.discount}
            setValue={(value) => applyPrice(value, "discount")}
            title={`${t("owner.discountedPriceTitle")} ${selectedDaysTitle}`}
          />
        ) : null}

        <Divider moreClass="w-full " />
        <Button
          width="w-full"
          onClick={onSubmit}
          loading={isPending}
          disabled={isPending}
          containerClass="w-full"
          roundedClass="rounded-full"
          title={t("owner.recordChanges")}
        />
      </div>
    </Modal>
  );
};

export default OwnerDayPriceModal;
