"use client";
import { OwnerCallendarItemDto, SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import Modal from "@/components/Modal";
import Button from "@/components/shared/Button/Button";
import { Divider } from "@/components/shared/Divider";
import RangeWithTitle from "@/components/shared/Form/RangeWithTitle";
import numberWithCommas from "@/helpers/numberWithCommas";
import _STRINGS from "@/utils/LocalStrings";
import { useMutation } from "@tanstack/react-query";
import { produce } from "immer";
import moment from "moment-jalaali";
import React, { useEffect, useState } from "react";

const ChangePriceModal = ({
  show,
  onHide,
  selectedDateData,
  setCallendarDataState,
  data,
}: {
  show: boolean;
  onHide: () => void | null;
  selectedDateData?: OwnerCallendarItemDto;
  setCallendarDataState: React.Dispatch<React.SetStateAction<OwnerCallendarItemDto[]>>;
  data: SingleOwnerPropertyDto;
}) => {
  const [price, setPrice] = useState(0);
  const [discontPrice, setdiscontPrice] = useState(0);

  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.UpdatePropertyPrice,
    onSuccess: () => {
      setCallendarDataState((e) => {
        const next = produce(e, (draft) => {
          const index = e.findIndex((i) => i.month == selectedDateData?.month && i.day === selectedDateData?.day);
          const x = { ...draft[index], price: price, discounted_price: discontPrice };
          draft[index] = x;
        });

        return next;
      });
      onHide();
    },
  });

  useEffect(() => {
    if (!!selectedDateData) {
      setPrice(selectedDateData?.price || 0);
      setdiscontPrice(selectedDateData?.discounted_price || 0);
    }

    return () => {
      setdiscontPrice(0);
      setPrice(0);
    };
  }, [selectedDateData]);

  const onSubmit = () => {
    mutate({
      property_id: data?.id,
      month: Number(selectedDateData?.month),
      year: Number(selectedDateData?.year),
      day: Number(selectedDateData?.day),
      discounted_price: discontPrice,
      price: price,
    });
  };
  return (
    <Modal show={show} onHide={onHide}>
      <div className="flex flex-col gap-4 p-4 bg-white rounded-20 ">
        <img className="w-9 h-9 aspect-square" src="/assets/icons/property/price_label.svg" />
        <p className="text-sm font-bold text-primary-700">{_STRINGS.IMMEDIATE_CHANGE}</p>
        <p className="text-xs">{_STRINGS.LOREM}</p>

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
            max={20000000}
            min={0}
            step={100000}
            marks={{
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
            }}
          />
        </div>

        <Divider moreClass="w-full " />
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
            max={20000000}
            min={0}
            step={100000}
            marks={{
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
            }}
          />
        </div>
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
