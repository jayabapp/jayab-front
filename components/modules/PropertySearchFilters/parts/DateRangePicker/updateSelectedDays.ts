import type { SearchSelectedDateRange } from "@/types/components/modules/search-date-range-picker";
import type { SearchDatePoint } from "@/types/components/modules/search-date-range-picker";
import type { Dispatch, SetStateAction } from "react";

import moment from "moment-jalaali";

export type TUpdateSelectedProps = {
  date: SearchDatePoint;
  state: SearchSelectedDateRange;
  setState: Dispatch<SetStateAction<SearchSelectedDateRange>>;
};

const updateSelectedDays = ({
  date,
  state,
  setState,
}: TUpdateSelectedProps) => {
  if (!date?.day || !date?.month || !date?.year) return;

  if (
    date.day == state.startDate?.day &&
    date.month == state.startDate?.month &&
    date.year == state.startDate?.year
  ) {
    setState({ endDate: null, startDate: null });
  } else if (
    date.day == state.endDate?.day &&
    date.month == state.endDate?.month &&
    date.year == state.endDate?.year
  ) {
    setState((current) => ({ ...current, endDate: null }));
  } else if (
    !state.startDate ||
    moment(`${date.year}/${date.month}/${date.day}`, "jYYYY/jMM/jD").isBefore(
      moment(
        `${state.startDate.year}/${state.startDate.month}/${state.startDate.day}`,
        "jYYYY/jMM/jD",
      ),
    )
  ) {
    setState({ startDate: date, endDate: null });
  } else {
    setState((current) => ({ ...current, endDate: date }));
  }
};

export default updateSelectedDays;
