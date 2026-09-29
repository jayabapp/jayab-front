import type { ReservationViewProps } from "@/types/components/modules/reservations";

import formatToman from "@/helpers/formatToman";
import _STRINGS from "@/utils/LocalStrings";
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
  const guests = `${reservation?.guests_count}`;
  const guestLabel = guests.includes("+")
    ? `${_STRINGS.MORE_THAN} ${guests.replace("+", "")}`
    : guests;

  return (
    <div className="w-full flex mt-2 flex-col gap-2">
      <SpecRow
        dots
        options={ROW_OPTIONS}
        title={_STRINGS.PPL_COUNT}
        value={`${guestLabel} ${_STRINGS.PERSON}`}
      />
      <SpecRow
        dots
        options={ROW_OPTIONS}
        title={_STRINGS.START_DATE}
        value={` ${moment(reservation?.check_in).format("ddd - jYYYY/jMM/jD")}`}
      />
      <SpecRow
        dots
        options={ROW_OPTIONS}
        title={_STRINGS.EXIT_DATE}
        value={` ${moment(reservation?.check_out).format("ddd - jYYYY/jMM/jD")}`}
      />
      <SpecRow
        dots
        options={ROW_OPTIONS}
        title={_STRINGS.DURATION}
        value={` ${moment(reservation?.check_out).diff(reservation?.check_in, "days")} ${_STRINGS.NIGHT}`}
      />
      <SpecRow
        dots
        options={ROW_OPTIONS}
        title={_STRINGS.TOTAL_STAY_COST}
        value={
          reservation?.quoted_total
            ? formatToman(reservation.quoted_total)
            : _STRINGS.RESERVE_AMOUNT_NOT_RECORDED
        }
      />
      {isOwner ? (
        <SpecRow
          dots
          options={ROW_OPTIONS}
          title={_STRINGS.REQUEST_DATE}
          value={`${moment(reservation?.created_at).format("HH:mm - jYYYY/jMM/jD")}`}
        />
      ) : null}
    </div>
  );
};

export default ReservationSchedule;
