"use client";

import { useEffect, useMemo, useState } from "react";
import { SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { OwnerCallendarItemDto } from "@/api_services/property/property.interface";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PropertyService } from "@/api_services/property/property.service";
import { toJalaaliDays } from "./jalaaliDays";
import { produce } from "immer";
import { Divider } from "@/components/shared/Divider";

import PriceRangeField from "./PriceRangeField";
import SmallLoading from "@/components/shared/Lotties/SmallLoading";
import useCmsContent from "@/hooks/useCmsContent";
import Checkbox from "@/components/shared/Form/Checkbox";
import _STRINGS from "@/utils/LocalStrings";
import CmsText from "@/components/shared/CmsText";
import Button from "@/components/shared/Button/Button";
import Notify from "@/components/shared/Toast";
import Modal from "@/components/Modal";
import moment from "moment-jalaali";

const MAX_PROPERTY_PRICE = 1000000000;
const DEFAULT_SLIDER_MAX = 20000000;
const DEFAULT_STEP = 100000;

export type TChangePriceModalProps = {
  show: boolean;
  onHide: () => void | null;
  selectedDatesData: OwnerCallendarItemDto[];
  callenderselectedDates: string[];
  setCallendarDataState: React.Dispatch<
    React.SetStateAction<OwnerCallendarItemDto[]>
  >;
  data: SingleOwnerPropertyDto;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChangePriceModal = ({
  show,
  data,
  onHide,
  setRefresh,
  selectedDatesData,
  setCallendarDataState,
  callenderselectedDates,
}: TChangePriceModalProps) => {
  const [hasDiscount, setHasDiscount] = useState(false);
  const [price, setPrice] = useState(0);
  const [discontPrice, setdiscontPrice] = useState(0);
  const [highestEnteredPrice, setHighestEnteredPrice] = useState(0);

  const selectedDays = useMemo(
    () => toJalaaliDays(callenderselectedDates),
    [callenderselectedDates],
  );

  const firstSelectedDay = selectedDays[0];
  const firstSelectedData = selectedDatesData[0];

  const { data: priceLimits } = useQuery({
    queryKey: [
      data?.id,
      firstSelectedDay?.day,
      firstSelectedDay?.year,
      firstSelectedDay?.month,
      PropertyService.OWNER_PROPERTIES_PRICE_RANGE_UPDATE_CACHEKEY,
    ],
    queryFn: () => {
      if (!!data?.id && !!firstSelectedDay?.month) {
        return PropertyService.ownerPropertyPriceRangeLimits({
          property_id: data?.id,
          day: firstSelectedDay?.day,
          month: firstSelectedDay?.month,
          year: firstSelectedDay?.year,
        });
      } else {
        return null;
      }
    },
  });

  const step = priceLimits?.step || DEFAULT_STEP;
  const minPrice = priceLimits?.min_price || 0;

  const sliderCeiling = useMemo(() => {
    const base = !!priceLimits?.base_price
      ? priceLimits.base_price * 2
      : DEFAULT_SLIDER_MAX;
    return Math.ceil(Math.max(base, highestEnteredPrice) / step) * step;
  }, [priceLimits, highestEnteredPrice, step]);

  const applyPrice = (value: number, setter: (e: number) => void) => {
    const next = Math.min(value, MAX_PROPERTY_PRICE);
    setter(next);
    setHighestEnteredPrice((prev) => Math.max(prev, next));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.updatePropertyPriceOfManyDays,
    onSuccess: () => {
      setCallendarDataState((e) => {
        const next = produce(e, (draft) => {
          for (const day of selectedDays) {
            const index = draft.findIndex(
              (i) =>
                i.month == day.month && i.day === day.day && i.year == day.year,
            );
            if (index < 0) continue;
            draft[index] = {
              ...draft[index],
              price: price,
              discounted_price: !!hasDiscount ? discontPrice : 0,
            };
          }
        });
        return next;
      });

      const hasToday = callenderselectedDates.some((selectedDate) =>
        moment().isSame(
          moment(selectedDate, "jYYYY/jMM/jD").format("YYYY/MM/DD"),
          "day",
        ),
      );
      if (hasToday) setRefresh((e) => !e);
      onHide();
    },
  });

  useEffect(() => {
    if (!!firstSelectedData) {
      setPrice(firstSelectedData?.price || 0);
      setdiscontPrice(firstSelectedData?.discounted_price || 0);
      setHasDiscount(!!firstSelectedData?.discounted_price ? true : false);
      setHighestEnteredPrice(
        Math.max(
          firstSelectedData?.price || 0,
          firstSelectedData?.discounted_price || 0,
        ),
      );
    }
    return () => {
      setdiscontPrice(0);
      setPrice(0);
      setHighestEnteredPrice(0);
    };
  }, [firstSelectedData]);

  const onSubmit = () => {
    if (!!hasDiscount && (discontPrice > price || discontPrice == price)) {
      Notify({ body: _STRINGS.DISCOUNT_BIGGER_THAN_PRICE, type: "warn" });
    } else {
      const discounted_price =
        !!hasDiscount && !!discontPrice && discontPrice != 0
          ? discontPrice
          : undefined;
      mutate({
        property_id: data?.id,
        days: selectedDays,
        discounted_price: discounted_price,
        price: price,
      });
    }
  };

  const { content: fastPriceChangeMessage, isLoading } = useCmsContent(
    "fastPriceChangeMessage",
    {
      enabled: !!show,
    },
  );

  const { content: discountPriceMessage, isLoading: isDiscountLoading } =
    useCmsContent("discountPriceMessage", { enabled: !!show });

  const selectedDaysTitle =
    selectedDays.length > 1
      ? `${selectedDays.length} ${_STRINGS.SELECTED_DAYS_COUNT}`
      : callenderselectedDates[0] || "";

  return (
    <Modal show={show} onHide={onHide}>
      <div className="flex flex-col gap-4 p-4 bg-white rounded-20 ">
        <img
          className="w-9 h-9 aspect-square"
          src="/assets/icons/property/price_label.svg"
        />
        <p className="text-sm font-bold text-primary-700">
          {_STRINGS.IMMEDIATE_CHANGE}
        </p>
        {isLoading ? (
          <SmallLoading />
        ) : (
          <CmsText className="text-xs">
            {fastPriceChangeMessage?.small_text || ""}
          </CmsText>
        )}

        <PriceRangeField
          title={`قیمت ${selectedDaysTitle}`}
          value={price}
          setValue={(e) => applyPrice(e, setPrice)}
          min={minPrice}
          max={sliderCeiling}
          step={step}
        />

        <Divider moreClass="w-full " />

        <img
          className="w-9 h-9 aspect-square"
          src="/assets/icons/property/discount_label.svg"
        />
        <p className="text-sm font-bold text-primary-700">
          {_STRINGS.DISCOUNTED_PRICE_TITLE}
        </p>
        {isDiscountLoading ? (
          <SmallLoading />
        ) : (
          <CmsText className="text-xs">
            {discountPriceMessage?.small_text || ""}
          </CmsText>
        )}

        <Checkbox
          title={_STRINGS.APPLY_DISCOUNT}
          isChecked={hasDiscount}
          onSelect={() => {
            setHasDiscount((e) => !e);
          }}
        />
        {!!hasDiscount ? (
          <PriceRangeField
            title={`${_STRINGS.DISCOUNTED_PRICE_TITLE} ${selectedDaysTitle}`}
            value={discontPrice}
            setValue={(e) => applyPrice(e, setdiscontPrice)}
            min={minPrice}
            max={sliderCeiling}
            step={step}
          />
        ) : (
          <></>
        )}
        <Divider moreClass="w-full " />
        <Button
          width="w-full"
          onClick={onSubmit}
          loading={isPending}
          containerClass="w-full"
          roundedClass="rounded-full"
          title={_STRINGS.RECORD_CHANGES}
        />
      </div>
    </Modal>
  );
};

export default ChangePriceModal;
