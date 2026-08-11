"use client";

import { SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { OwnerCallendarItemDto } from "@/api_services/property/property.interface";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { PropertyService } from "@/api_services/property/property.service";
import { produce } from "immer";
import { Divider } from "@/components/shared/Divider";

import numberWithCommas from "@/helpers/numberWithCommas";
import RangeWithTitle from "@/components/shared/Form/RangeWithTitle";
import SmallLoading from "@/components/shared/Lotties/SmallLoading";
import useCmsContent from "@/hooks/useCmsContent";
import Checkbox from "@/components/shared/Form/Checkbox";
import _STRINGS from "@/utils/LocalStrings";
import CmsText from "@/components/shared/CmsText";
import Button from "@/components/shared/Button/Button";
import Notify from "@/components/shared/Toast";
import Modal from "@/components/Modal";
import moment from "moment-jalaali";

const ChangePriceModal = ({
  show,
  onHide,
  selectedDateData,
  setCallendarDataState,
  data,
  setRefresh,
}: {
  show: boolean;
  onHide: () => void | null;
  selectedDateData?: OwnerCallendarItemDto;
  setCallendarDataState: React.Dispatch<
    React.SetStateAction<OwnerCallendarItemDto[]>
  >;
  data: SingleOwnerPropertyDto;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [hasDiscount, setHasDiscount] = useState(false);
  const [price, setPrice] = useState(0);
  const [discontPrice, setdiscontPrice] = useState(0);
  const [marks, setMarks] = useState<{ [key: string]: any }>({
    0: {
      label: "0",
      style: {
        color: "#888",
        paddingTop: 15,
      },
    },
    20000000: {
      label: "20000000",
      style: {
        color: "#888",
        paddingTop: 15,
        paddingRight: 20,
      },
    },
  });

  const { data: priceLimits } = useQuery({
    queryKey: [
      data?.id,
      selectedDateData?.day,
      selectedDateData?.year,
      selectedDateData?.month,
      PropertyService.OWNER_PROPERTIES_PRICE_RANGE_UPDATE_CACHEKEY,
    ],
    queryFn: () => {
      if (!!data?.id && !!selectedDateData?.month) {
        return PropertyService.ownerPropertyPriceRangeLimits({
          property_id: data?.id,
          day: selectedDateData?.day,
          month: selectedDateData?.month,
          year: selectedDateData?.year,
        });
      } else {
        return null;
      }
    },
  });

  useEffect(() => {
    if (!!priceLimits?.max_price) {
      let marksdata: any = {};
      marksdata[priceLimits?.min_price] = {
        label: priceLimits?.min_price,
        style: {
          color: "#888",
          paddingTop: 15,
          paddingLeft: 20,
        },
      };
      marksdata[priceLimits?.max_price] = {
        label: priceLimits?.max_price,
        style: {
          color: "#888",
          paddingTop: 15,
          paddingRight: 20,
        },
      };

      setMarks(marksdata);
    }
  }, [priceLimits]);

  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.UpdatePropertyPrice,
    onSuccess: () => {
      setCallendarDataState((e) => {
        const next = produce(e, (draft) => {
          const index = e.findIndex(
            (i) =>
              i.month == selectedDateData?.month &&
              i.day === selectedDateData?.day,
          );
          const x = {
            ...draft[index],
            price: price,
            discounted_price: !!hasDiscount ? discontPrice : 0,
          };
          draft[index] = x;
        });
        return next;
      });

      const selectedTime = moment(
        `${selectedDateData?.year}/${selectedDateData?.month}/${selectedDateData?.day}`,
        "jYYYY/jMM/jD",
      ).format("YYYY/MM/DD");
      if (selectedDateData && moment().isSame(selectedTime, "day"))
        setRefresh((e) => !e);
      onHide();
    },
  });

  useEffect(() => {
    if (!!selectedDateData) {
      setPrice(selectedDateData?.price || 0);
      setdiscontPrice(selectedDateData?.discounted_price || 0);
      setHasDiscount(!!selectedDateData?.discounted_price ? true : false);
    }
    return () => {
      setdiscontPrice(0);
      setPrice(0);
    };
  }, [selectedDateData]);

  const onSubmit = () => {
    if (discontPrice > price || discontPrice == price) {
      Notify({ body: _STRINGS.DISCOUNT_BIGGER_THAN_PRICE, type: "warn" });
    } else {
      const discounted_price =
        !!hasDiscount && !!discontPrice && discontPrice != 0
          ? discontPrice
          : undefined;
      mutate({
        property_id: data?.id,
        month: Number(selectedDateData?.month),
        year: Number(selectedDateData?.year),
        day: Number(selectedDateData?.day),
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

        <div className="flex flex-col gap-3 text-primary-700 pt-6 pb-10">
          <div className="flex items-center justify-between">
            <span>
              قیمت {selectedDateData?.year}/{selectedDateData?.month}/
              {selectedDateData?.day}
            </span>
            <span>{numberWithCommas(price)}</span>
          </div>
          <RangeWithTitle
            marks={marks}
            value={price}
            setValue={setPrice}
            min={priceLimits?.min_price || 0}
            step={priceLimits?.step || 100000}
            max={priceLimits?.max_price || 20000000}
          />
        </div>

        <Divider moreClass="w-full " />
        <Checkbox
          title="تخفیف دار"
          isChecked={hasDiscount}
          onSelect={() => {
            setHasDiscount((e) => !e);
          }}
        />
        {!!hasDiscount ? (
          <div className="flex flex-col gap-3 text-primary-700 pt-6 pb-10">
            <div className="flex items-center justify-between">
              <span>
                قیمت با تخفیف {selectedDateData?.year}/{selectedDateData?.month}
                /{selectedDateData?.day}
              </span>
              <span>{numberWithCommas(discontPrice)}</span>
            </div>
            <RangeWithTitle
              marks={marks}
              value={discontPrice}
              setValue={setdiscontPrice}
              step={priceLimits?.step || 100000}
              min={priceLimits?.min_price || 0}
              max={priceLimits?.max_price || 20000000}
            />
          </div>
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
