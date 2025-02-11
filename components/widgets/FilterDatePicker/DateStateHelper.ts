import moment from "moment-jalaali";
import React from "react";

type DateStateHelperType = {
  date: { day?: number | string; month?: number | string; year: number | string };
  state: {
    startDate: {
      day: string | number | undefined;
      month: string | number | undefined;
      year: string | number | undefined;
    } | null;
    endDate: {
      day: string | number | undefined;
      month: string | number | undefined;
      year: string | number | undefined;
    } | null;
  };
  setState: React.Dispatch<
    React.SetStateAction<{
      startDate: {
        day: string | number | undefined;
        month: string | number | undefined;
        year: string | number | undefined;
      } | null;
      endDate: {
        day: string | number | undefined;
        month: string | number | undefined;
        year: string | number | undefined;
      } | null;
    }>
  >;
};

const DateStateHelper = ({ date, state, setState }: DateStateHelperType) => {
  if (!!date?.day && !!date?.month && !!date?.year) {
    if (
      date?.day == state?.startDate?.day &&
      date?.month == state?.startDate?.month &&
      date?.year == state?.startDate?.year
    ) {
      setState({ endDate: null, startDate: null });
    } else if (
      date?.day == state?.endDate?.day &&
      date?.month == state?.endDate?.month &&
      date?.year == state?.endDate?.year
    ) {
      setState((e) => ({ ...e, endDate: null }));
    } else if (
      !state?.startDate ||
      moment(`${date?.year}/${date?.month}/${date?.day}`, "jYYYY/jMM/jD").isBefore(
        moment(`${state?.startDate?.year}/${state?.startDate?.month}/${state?.startDate?.day}`, "jYYYY/jMM/jD")
      )
    ) {
      setState({
        startDate: {
          day: date?.day,
          month: date?.month,
          year: date?.year,
        },
        endDate: null,
      });
    } else {
      setState((e) => ({
        ...e,
        endDate: {
          day: date?.day,
          month: date?.month,
          year: date?.year,
        },
      }));
    }
  }
};

export default DateStateHelper;
