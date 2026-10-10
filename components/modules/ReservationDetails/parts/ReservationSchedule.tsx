
import { useTranslations } from "next-intl";
import { useFormatToman } from "@hooks/useFormatToman";

import type { ReservationViewProps } from "@/types/components/modules/reservations";

import SpecRow from "@elements/SpecRow";
import moment from "moment-jalaali";

moment.loadPersian({ dialect: "persian-modern" });

const ROW_OPTIONS = {
  title_class: " !font-normal !text-sm",
  value_class: "!text-sm",
};

const ReservationSchedule = ({
  isOwner,
  reservation,
}: ReservationViewProps) => {
  const formatToman = useFormatToman();

  const t = useTranslations();

  const guests = `${reservation?.guests_count}`;
  const guestLabel = guests.includes("+")
    ? `${t("reserve.moreThan")} ${guests.replace("+", "")}`
    : guests;

  return (
    <div className="w-full flex mt-2 flex-col gap-2">
      <SpecRow
        dots
        options={ROW_OPTIONS}
        title={t("common.pplCount")}
        value={`${t("common.people", { count: Number(guestLabel) })}`}
      />
      <SpecRow
        dots
        options={ROW_OPTIONS}
        title={t("reserve.startDate")}
        value={` ${moment(reservation?.check_in).format("ddd - jYYYY/jMM/jD")}`}
      />
      <SpecRow
        dots
        options={ROW_OPTIONS}
        title={t("reserve.exitDate")}
        value={` ${moment(reservation?.check_out).format("ddd - jYYYY/jMM/jD")}`}
      />
      <SpecRow
        dots
        options={ROW_OPTIONS}
        title={t("reserve.duration")}
        value={` ${t("reserve.nights", { count: Number(moment(reservation?.check_out).diff(reservation?.check_in, "days")) })}`}
      />
      <SpecRow
        dots
        options={ROW_OPTIONS}
        title={t("reserve.totalStayCost")}
        value={
          reservation?.quoted_total
            ? formatToman(reservation.quoted_total)
            : t("reserve.reserveAmountNotRecorded")
        }
      />
      {isOwner ? (
        <SpecRow
          dots
          options={ROW_OPTIONS}
          title={t("reserve.requestDate")}
          value={`${moment(reservation?.created_at).format("HH:mm - jYYYY/jMM/jD")}`}
        />
      ) : null}
    </div>
  );
};

export default ReservationSchedule;
