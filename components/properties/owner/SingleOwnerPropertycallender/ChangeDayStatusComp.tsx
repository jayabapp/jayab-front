import { SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { OwnerCallendarItemDto } from "@/api_services/property/property.interface";
import { useUpdateDayStatus } from "@features/owner-property/hooks/useUpdateDayStatus";
import { toJalaaliDays } from "./jalaaliDays";
import { useState } from "react";
import { produce } from "immer";

import ConfirmModal from "@/components/Modal/ConfirmModal";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@/components/shared/Button/Button";
import moment from "moment-jalaali";

export type TChangeDayStatusProps = {
  callenderselectedDates: string[];
  selectedDatesData: OwnerCallendarItemDto[];
  data: SingleOwnerPropertyDto;
  setCallendarDataState: React.Dispatch<
    React.SetStateAction<OwnerCallendarItemDto[]>
  >;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChangeDayStatusComp = ({
  data,
  setRefresh,
  selectedDatesData,
  setCallendarDataState,
  callenderselectedDates,
}: TChangeDayStatusProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const selectedDays = toJalaaliDays(callenderselectedDates);

  const isEveryDayReserved =
    selectedDays.length > 0 &&
    selectedDays.length === selectedDatesData.length &&
    selectedDatesData.every((e) => !!e?.is_reserved);
  const nextReservedStatus = !isEveryDayReserved;

  const { mutate, isPending } = useUpdateDayStatus(data?.id ?? "");
  const submitStatus = (variables: Parameters<typeof mutate>[0]) => mutate(variables, { onSuccess: () => {
      setCallendarDataState((e) => {
        const next = produce(e, (draft) => {
          for (const day of selectedDays) {
            const index = draft.findIndex(
              (i) =>
                i.month == day.month && i.day === day.day && i.year == day.year,
            );
            if (index < 0) continue;
            draft[index] = { ...draft[index], is_reserved: nextReservedStatus };
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
    }});

  const onSubmit = () => {
    submitStatus({
      property_id: data?.id,
      days: selectedDays,
      is_reserved: nextReservedStatus,
    });
  };
  const onHide = () => {
    setShowConfirm(false);
  };

  const confirmText =
    selectedDays.length > 1
      ? `آیا از ${nextReservedStatus ? "رزرو" : "خالی"} کردن ${selectedDays.length} ${_STRINGS.SELECTED_DAYS_COUNT} اطمینان دارید؟`
      : `آیا از ${nextReservedStatus ? "رزرو" : "خالی"} کردن روز ${callenderselectedDates[0]} اطمینان دارید؟`;

  return (
    <div className="w-full">
      {" "}
      <Button
        onClick={() => {
          setShowConfirm(true);
        }}
        loading={isPending}
        width="w-full !py-1.5"
        containerClass="w-full"
        roundedClass="rounded-full"
        title={_STRINGS.EMPTY_FULL}
        disabled={selectedDays.length === 0}
      />
      <ConfirmModal
        isLoading={isPending}
        isVisible={!!showConfirm}
        onConfirm={() => {
          onSubmit();
        }}
        text={confirmText}
        onHide={onHide}
      />
    </div>
  );
};

export default ChangeDayStatusComp;
