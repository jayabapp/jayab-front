"use client";

import { useOwnerCalendarActions } from "@features/owner-property/hooks/useOwnerCalendarActions";
import type { OwnerSingleDayModalProps } from "@/types/components/modules/owner-property";
import { ContentImage } from "@elements/Image";
import { Divider } from "@elements/Divider";
import { colors } from "@/theme/colors";
import { useState } from "react";

import SkeletonText from "@elements/Skeleton/SkeletonText";
import useCmsContent from "@/hooks/useCmsContent";
import RangeWithTitle from "@elements/Slider";
import _STRINGS from "@/utils/LocalStrings";
import CmsText from "@elements/CmsText";
import Button from "@elements/Button";
import Modal from "@elements/Modal";

const COMMISSION_MARKS = {
  0: { label: "0", style: { color: colors.neutral[400], paddingTop: 15 } },
  50: {
    label: "50",
    style: { color: colors.neutral[400], paddingTop: 15, paddingRight: 20 },
  },
};

const OwnerDayCommissionModal = ({
  day,
  show,
  onHide,
  property,
}: OwnerSingleDayModalProps) => {
  const {
    commission: { mutate, isPending },
  } = useOwnerCalendarActions(property?.id ?? "");

  const seedKey = `${day?.year ?? ""}/${day?.month ?? ""}/${day?.day ?? ""}`;
  const [draft, setDraft] = useState({ key: "", value: 0 });
  let current = draft;
  if (current.key !== seedKey)
    current = { key: seedKey, value: day?.advisor_commission || 0 };
  if (current !== draft) setDraft(current);

  const onSubmit = () => {
    if (isPending) return;
    mutate(
      {
        advisor_commission: current.value,
        day: Number(day?.day),
        month: Number(day?.month),
        property_id: property?.id,
        year: Number(day?.year),
      },
      { onSuccess: onHide },
    );
  };

  const { content: changeCommision, isLoading } = useCmsContent(
    "changeCommision",
    { enabled: !!show },
  );

  return (
    <Modal show={show} onHide={onHide}>
      <div className="flex flex-col gap-4 p-4 bg-white rounded-20">
        <ContentImage
          alt=""
          width={36}
          height={36}
          className="w-9 h-9 aspect-square"
          src="/assets/icons/property/hand_shake_money.svg"
        />
        <p className="text-sm font-bold text-brand-600">
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
            <span>{current.value} %</span>
          </div>
          <RangeWithTitle
            max={50}
            min={0}
            step={5}
            value={current.value}
            marks={COMMISSION_MARKS}
            setValue={(value: number) =>
              setDraft((previous) => ({ ...previous, value }))
            }
          />
        </div>

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

export default OwnerDayCommissionModal;
