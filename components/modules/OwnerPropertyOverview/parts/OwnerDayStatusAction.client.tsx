"use client";

import type { OwnerDaySelectionProps } from "@/types/components/modules/owner-property";
import { useUpdateDayStatus } from "@features/owner-property/hooks/useUpdateDayStatus";
import { toJalaaliDays } from "@features/owner-property/lib/calendar-cache";
import { useState } from "react";

import ConfirmModal from "@elements/Modal/ConfirmModal.client";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

const OwnerDayStatusAction = ({
  property,
  selectedDates,
  selectedDaysData,
}: OwnerDaySelectionProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { mutate, isPending } = useUpdateDayStatus(property?.id ?? "");

  const selectedDays = toJalaaliDays(selectedDates);
  const isEveryDayReserved =
    selectedDays.length > 0 &&
    selectedDays.length === selectedDaysData.length &&
    selectedDaysData.every((day) => !!day?.is_reserved);
  const nextReservedStatus = !isEveryDayReserved;

  const onSubmit = () => {
    if (isPending) return;
    mutate(
      {
        days: selectedDays,
        is_reserved: nextReservedStatus,
        property_id: property?.id,
      },
      { onSuccess: () => setShowConfirm(false) },
    );
  };

  const action = nextReservedStatus ? _STRINGS.RESERVE : _STRINGS.EMPTY;
  const target =
    selectedDays.length > 1
      ? `${selectedDays.length} ${_STRINGS.SELECTED_DAYS_COUNT}`
      : `${_STRINGS.DAY} ${selectedDates[0] || ""}`;
  const confirmText = `${_STRINGS.ARE_U_SURE_ABOUT} ${action} ${_STRINGS.MAKING_OF} ${target} ${_STRINGS.ARE_U_SURE_SUFFIX}`;

  return (
    <div className="w-full">
      <Button
        loading={isPending}
        width="w-full !py-1.5"
        containerClass="w-full"
        roundedClass="rounded-full"
        title={_STRINGS.EMPTY_FULL}
        onClick={() => setShowConfirm(true)}
        disabled={selectedDays.length === 0 || isPending}
      />
      <ConfirmModal
        text={confirmText}
        isLoading={isPending}
        onConfirm={onSubmit}
        isVisible={!!showConfirm}
        onHide={() => setShowConfirm(false)}
      />
    </div>
  );
};

export default OwnerDayStatusAction;
