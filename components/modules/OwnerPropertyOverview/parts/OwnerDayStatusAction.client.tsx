"use client";

import { useUpdateDayStatus } from "@features/owner-property/hooks/useUpdateDayStatus";
import { useTranslations } from "next-intl";
import { toJalaaliDays } from "@features/owner-property/lib/calendar-cache";
import { useState } from "react";

import type { OwnerDaySelectionProps } from "@/types/components/modules/owner-property";

import ConfirmModal from "@elements/Modal/ConfirmModal.client";
import Button from "@elements/Button";

const OwnerDayStatusAction = ({
  property,
  selectedDates,
  selectedDaysData,
}: OwnerDaySelectionProps) => {
  const t = useTranslations();

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

  const action = nextReservedStatus
    ? t("common.reserve")
    : t("common.emptySlot");
  const target =
    selectedDays.length > 1
      ? `${t("owner.selectedDays", { count: Number(selectedDays.length) })}`
      : `${t("common.day")} ${selectedDates[0] || ""}`;
  const confirmText = `${t("owner.areUSureAbout")} ${action} ${t("owner.makingOf")} ${target} ${t("owner.areUSureSuffix")}`;

  return (
    <div className="w-full">
      <Button
        loading={isPending}
        width="w-full !py-1.5"
        containerClass="w-full"
        roundedClass="rounded-full"
        title={t("owner.emptyFull")}
        onClick={() => setShowConfirm(true)}
        disabled={selectedDays.length === 0 || isPending}
      />
      <ConfirmModal
        text={confirmText}
        onConfirm={onSubmit}
        isLoading={isPending}
        isVisible={!!showConfirm}
        onHide={() => setShowConfirm(false)}
      />
    </div>
  );
};

export default OwnerDayStatusAction;
