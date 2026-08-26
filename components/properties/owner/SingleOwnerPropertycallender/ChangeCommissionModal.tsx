"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useOwnerCalendarActions } from "@features/owner-property/hooks/useOwnerCalendarActions";
import { SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { OwnerCallendarItemDto } from "@/api_services/property/property.interface";
import { useEffect, useState } from "react";
import { Divider } from "@/components/shared/Divider";
import { produce } from "immer";

import RangeWithTitle from "@/components/shared/Form/RangeWithTitle";
import useCmsContent from "@/hooks/useCmsContent";
import SmallLoading from "@/components/shared/Lotties/SmallLoading";
import _STRINGS from "@/utils/LocalStrings";
import CmsText from "@/components/shared/CmsText";
import Button from "@/components/shared/Button/Button";
import Modal from "@/components/Modal";

type TChangeCommissionModalProps = {
  show: boolean;
  onHide: () => void | null;
  selectedDateData?: OwnerCallendarItemDto;
  setCallendarDataState: React.Dispatch<
    React.SetStateAction<OwnerCallendarItemDto[]>
  >;
  data: SingleOwnerPropertyDto;
};

const ChangeCommissionModal = ({
  show,
  data,
  onHide,
  selectedDateData,
  setCallendarDataState,
}: TChangeCommissionModalProps) => {
  const [commission, setCommission] = useState(0);

  const {
    commission: { mutate, isPending },
  } = useOwnerCalendarActions(data?.id ?? "");
  const submitCommission = (variables: Parameters<typeof mutate>[0]) =>
    mutate(variables, {
      onSuccess: () => {
        setCallendarDataState((e) => {
          const next = produce(e, (draft) => {
            const index = e.findIndex(
              (i) =>
                i.month == selectedDateData?.month &&
                i.day === selectedDateData?.day,
            );
            const x = { ...draft[index], advisor_commission: commission };
            draft[index] = x;
          });

          return next;
        });
        onHide();
      },
    });

  useEffect(() => {
    if (!!selectedDateData)
      setCommission(selectedDateData?.advisor_commission || 0);
    return () => {
      setCommission(0);
    };
  }, [selectedDateData]);

  const onSubmit = () => {
    submitCommission({
      property_id: data?.id,
      advisor_commission: commission,
      day: Number(selectedDateData?.day),
      month: Number(selectedDateData?.month),
      year: Number(selectedDateData?.year),
    });
  };

  const { content: changeCommision, isLoading } = useCmsContent(
    "changeCommision",
    { enabled: !!show },
  );

  return (
    <Modal show={show} onHide={onHide}>
      <div className="flex flex-col gap-4 p-4 bg-white rounded-20 ">
        <img
          className="w-9 h-9 aspect-square"
          src="/assets/icons/property/hand_shake_money.svg"
        />
        <p className="text-sm font-bold text-primary-700">
          {_STRINGS.CHANGE_ADVISOR_COMMISSION}
        </p>
        {isLoading ? (
          <SmallLoading />
        ) : (
          <CmsText className="text-xs">
            {changeCommision?.small_text || ""}
          </CmsText>
        )}

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

export default ChangeCommissionModal;
