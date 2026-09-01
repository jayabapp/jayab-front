"use client";

import type { OwnerDayPriceModalProps } from "@/types/components/modules/owner-property";
import { useOwnerPriceLimits } from "@features/owner-property/hooks/useOwnerPriceLimits";
import { useUpdateDayPrice } from "@features/owner-property/hooks/useUpdateDayPrice";
import { toJalaaliDays } from "@features/owner-property/lib/calendar-cache";
import { ContentImage } from "@elements/Image";
import { Divider } from "@elements/Divider";
import { Checkbox } from "@elements/Form";
import { useMemo, useState } from "react";

import SkeletonText from "@elements/Skeleton/SkeletonText";
import OwnerPriceRangeField from "./OwnerPriceRangeField";
import useCmsContent from "@/hooks/useCmsContent";
import _STRINGS from "@/utils/LocalStrings";
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
      Notify({ body: _STRINGS.DISCOUNT_BIGGER_THAN_PRICE, type: "warn" });
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
      ? `${selectedDays.length} ${_STRINGS.SELECTED_DAYS_COUNT}`
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
          {_STRINGS.IMMEDIATE_CHANGE}
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
          title={`${_STRINGS.PRICE} ${selectedDaysTitle}`}
          setValue={(value) => applyPrice(value, "price")}
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
          {_STRINGS.DISCOUNTED_PRICE_TITLE}
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
          title={_STRINGS.APPLY_DISCOUNT}
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
            title={`${_STRINGS.DISCOUNTED_PRICE_TITLE} ${selectedDaysTitle}`}
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
          title={_STRINGS.RECORD_CHANGES}
        />
      </div>
    </Modal>
  );
};

export default OwnerDayPriceModal;
