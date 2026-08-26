"use client";
import { HomeService } from "@/api_services/home/home.service";
import { OwnerCallendarItemDto, SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import Modal from "@/components/Modal";
import Button from "@/components/shared/Button/Button";
import { Divider } from "@/components/shared/Divider";
import RangeWithTitle from "@/components/shared/Form/RangeWithTitle";
import SmallLoading from "@/components/shared/Lotties/SmallLoading";
import _STRINGS from "@/utils/LocalStrings";
import { useMutation, useQuery } from "@tanstack/react-query";
import { produce } from "immer";
import React, { useEffect, useState } from "react";

const ChangePropertyAllDaysCommissionModal = ({
  show,
  onHide,

  data,
}: {
  show: boolean;
  onHide: () => void | null;

  data: SingleOwnerPropertyDto;
}) => {
  const [commission, setCommission] = useState(0);
  const [defaultCommission, setDefaultCommission] = useState(0);

  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.UpdatePropertyAllDaysAdvisorCommission,
    onSuccess: (e) => {
      if (!!e) {
        setDefaultCommission(e);
      }
      onHide();
    },
  });

  useEffect(() => {
    if (!!data && !defaultCommission) {
      setDefaultCommission(data?.advisor_commission || 0);
    }
  }, [data]);

  useEffect(() => {
    if (!!defaultCommission) {
      setCommission(defaultCommission || 0);
    } else {
      setCommission(0);
    }
  }, [defaultCommission, show]);

  const onSubmit = () => {
    mutate({
      property_id: data?.id,

      advisor_commission: commission,
    });
  };

  /* -------------------------------------------------------------------------- */
  /*                                   CONTENT                                  */
  /* -------------------------------------------------------------------------- */
  const { data: changeCommision, isLoading } = useQuery({
    queryKey: [HomeService?.CONTENT_BY_KEY_CACHEKEY, "changeCommision", 1, show],
    queryFn: () => {
      if (show) return HomeService.GetContentByKey({ key: "changeCommision" });
      else return null;
    },
  });
  return (
    <Modal show={show} onHide={onHide}>
      <div className="flex flex-col gap-4 p-4 bg-white rounded-20 ">
        <img className="w-9 h-9 aspect-square" src="/assets/icons/property/hand_shake_money.svg" />
        <p className="text-base font-bold text-primary-700">{_STRINGS.CHANGE_ADVISOR_COMMISSION}</p>
        {isLoading ? <SmallLoading /> : <p className="text-xs">{changeCommision?.small_text || ""}</p>}

        <div className="flex flex-col gap-3 text-primary-700 pt-6 pb-10">
          <div className="flex items-center justify-between">
            <span>{_STRINGS.COMITION_PERC}</span>
            <span>{commission} %</span>
          </div>
          <RangeWithTitle
            value={commission}
            setValue={setCommission}
            max={50}
            min={0}
            step={5}
            marks={{
              0: {
                label: "0",
                style: {
                  color: "#888",
                  paddingTop: 15,
                },
              },
              50: {
                label: "50",
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

export default ChangePropertyAllDaysCommissionModal;
