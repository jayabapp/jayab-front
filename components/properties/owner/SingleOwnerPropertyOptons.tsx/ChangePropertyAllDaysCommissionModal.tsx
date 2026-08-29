"use client";

import { colors } from "@/theme/colors";

/* eslint-disable react-hooks/set-state-in-effect */

import { useOwnerCalendarActions } from "@features/owner-property/hooks/useOwnerCalendarActions";
import { SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { useEffect, useState } from "react";
import { Divider } from "@elements/Divider";

import RangeWithTitle from "@elements/Slider";
import useCmsContent from "@/hooks/useCmsContent";
import SkeletonText from "@/components/elements/Skeleton/SkeletonText";
import _STRINGS from "@/utils/LocalStrings";
import CmsText from "@/components/shared/CmsText";
import Button from "@elements/Button";
import Modal from "@elements/Modal";

const ChangePropertyAllDaysCommissionModal = ({
  data,
  show,
  onHide,
}: {
  show: boolean;
  onHide: () => void | null;
  data: SingleOwnerPropertyDto;
}) => {
  const [commission, setCommission] = useState(0);
  const [defaultCommission, setDefaultCommission] = useState(0);

  const {
    allDaysCommission: { mutate, isPending },
  } = useOwnerCalendarActions(data?.id ?? "");
  const submitCommission = (variables: Parameters<typeof mutate>[0]) =>
    mutate(variables, {
      onSuccess: (e) => {
        if (!!e) setDefaultCommission(e);
        onHide();
      },
    });

  useEffect(() => {
    if (!!data && !defaultCommission)
      setDefaultCommission(data?.advisor_commission || 0);
  }, [data]);

  useEffect(() => {
    if (!!defaultCommission) setCommission(defaultCommission || 0);
    else setCommission(0);
  }, [defaultCommission, show]);

  const onSubmit = () => {
    submitCommission({
      property_id: data?.id,
      advisor_commission: commission,
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
        <p className="text-base font-bold text-brand-600">
          {_STRINGS.CHANGE_ADVISOR_COMMISSION}
        </p>
        {isLoading ? (
          <SkeletonText lines={3} />
        ) : (
          <CmsText className="text-xs">
            {changeCommision?.small_text || ""}
          </CmsText>
        )}

        <div className="flex flex-col gap-3 text-brand-600 pt-6 pb-10">
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
                  color: colors.neutral[400],
                  paddingTop: 15,
                },
              },
              50: {
                label: "50",
                style: {
                  color: colors.neutral[400],
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

export default ChangePropertyAllDaysCommissionModal;
