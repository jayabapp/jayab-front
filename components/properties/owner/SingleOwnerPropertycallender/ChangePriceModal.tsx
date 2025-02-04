"use client";
import { HomeService } from "@/api_services/home/home.service";
import { OwnerCallendarItemDto, SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import Modal from "@/components/Modal";
import Button from "@/components/shared/Button/Button";
import { Divider } from "@/components/shared/Divider";
import Checkbox from "@/components/shared/Form/Checkbox";
import RangeWithTitle from "@/components/shared/Form/RangeWithTitle";
import SmallLoading from "@/components/shared/Lotties/SmallLoading";
import Notify from "@/components/shared/Toast";
import numberWithCommas from "@/helpers/numberWithCommas";
import _STRINGS from "@/utils/LocalStrings";
import { useMutation, useQuery } from "@tanstack/react-query";
import { produce } from "immer";
import moment from "moment-jalaali";
import React, { useEffect, useState } from "react";

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
  setCallendarDataState: React.Dispatch<React.SetStateAction<OwnerCallendarItemDto[]>>;
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

  /* -------------------------------------------------------------------------- */
  /*                             RANGE PRICE LIMITS                             */
  /* -------------------------------------------------------------------------- */
  const { data: priceLimits } = useQuery({
    queryKey: [
      PropertyService.OWNER_PROPERTIES_PRICE_RANGE_UPDATE_CACHEKEY,
      data?.id,
      selectedDateData?.day,
      selectedDateData?.month,
      selectedDateData?.year,
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

  ////////////////////////////
  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.UpdatePropertyPrice,
    onSuccess: () => {
      setCallendarDataState((e) => {
        const next = produce(e, (draft) => {
          const index = e.findIndex((i) => i.month == selectedDateData?.month && i.day === selectedDateData?.day);
          const x = { ...draft[index], price: price, discounted_price: !!hasDiscount ? discontPrice : 0 };
          draft[index] = x;
        });

        return next;
      });

      /* -------------------------------- IF TODAY -------------------------------- */

      const selectedTime = moment(
        `${selectedDateData?.year}/${selectedDateData?.month}/${selectedDateData?.day}`,
        "jYYYY/jMM/jD"
      ).format("YYYY/MM/DD");

      if (selectedDateData && moment().isSame(selectedTime, "day")) {
        setRefresh((e) => !e);
      }

      onHide();
    },
  });

  useEffect(() => {
    if (!!selectedDateData) {
      setPrice(selectedDateData?.price || 0);
      setHasDiscount(!!selectedDateData?.discounted_price ? true : false);
      setdiscontPrice(selectedDateData?.discounted_price || 0);
    }

    return () => {
      setdiscontPrice(0);
      setPrice(0);
    };
  }, [selectedDateData]);

  const onSubmit = () => {
    if (discontPrice > price) {
      Notify({ body: _STRINGS.DISCOUNT_BIGGER_THAN_PRICE, type: "warn" });
    } else {
      mutate({
        property_id: data?.id,
        month: Number(selectedDateData?.month),
        year: Number(selectedDateData?.year),
        day: Number(selectedDateData?.day),
        discounted_price: !!hasDiscount ? discontPrice : undefined,
        price: price,
      });
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   CONTENT                                  */
  /* -------------------------------------------------------------------------- */
  const { data: fastPriceChangeMessage, isLoading } = useQuery({
    queryKey: [HomeService?.CONTENT_BY_KEY_CACHEKEY, "fastPriceChangeMessage", 1, show],
    queryFn: () => {
      if (show) return HomeService.GetContentByKey({ key: "fastPriceChangeMessage" });
      else return null;
    },
  });

  return (
    <Modal show={show} onHide={onHide}>
      <div className="flex flex-col gap-4 p-4 bg-white rounded-20 ">
        <img className="w-9 h-9 aspect-square" src="/assets/icons/property/price_label.svg" />
        <p className="text-sm font-bold text-primary-700">{_STRINGS.IMMEDIATE_CHANGE}</p>
        <p className="text-xs">{isLoading ? <SmallLoading /> : fastPriceChangeMessage?.small_text || ""}</p>

        <div className="flex flex-col gap-3 text-primary-700 pt-6 pb-10">
          <div className="flex items-center justify-between">
            <span>
              قیمت {selectedDateData?.day}/{selectedDateData?.month}/{selectedDateData?.year}
            </span>
            <span>{numberWithCommas(price)}</span>
          </div>
          <RangeWithTitle
            value={price}
            setValue={setPrice}
            max={priceLimits?.max_price || 20000000}
            min={priceLimits?.min_price || 0}
            step={priceLimits?.step || 100000}
            marks={marks}
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
                قیمت با تخفیف {selectedDateData?.day}/{selectedDateData?.month}/{selectedDateData?.year}
              </span>
              <span>{numberWithCommas(discontPrice)}</span>
            </div>
            <RangeWithTitle
              value={discontPrice}
              setValue={setdiscontPrice}
              max={priceLimits?.max_price || 20000000}
              min={priceLimits?.min_price || 0}
              step={priceLimits?.step || 100000}
              marks={marks}
            />
          </div>
        ) : (
          <></>
        )}
        <Divider moreClass="w-full " />
        <Button
          onClick={onSubmit}
          title={_STRINGS.RECORD_CHANGES}
          loading={isPending}
          roundedClass="rounded-full"
          containerClass="w-full"
          width="w-full"
        />
      </div>
    </Modal>
  );
};

export default ChangePriceModal;
