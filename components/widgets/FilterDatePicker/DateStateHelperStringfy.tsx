import startOfDate from "@/helpers/StartOfDate";
import moment from "moment-jalaali";
import React from "react";

type DateStateHelperStringfyType = {
  date: string;
  state: {
    checkin: string | null | undefined;
    checkout: string | null | undefined;
  };
  setState: React.Dispatch<
    React.SetStateAction<{
      checkin: string | null | undefined;
      checkout: string | null | undefined;
    }>
  >;
  cb?: () => void | null;
};

const DateStateHelperStringfy = ({ date, state, setState, cb }: DateStateHelperStringfyType) => {
  if (!!date) {
    if (moment(startOfDate(moment(date, "jYYYY/jMM/jD").toDate())).toISOString() == state?.checkin) {
      setState((e) => ({ ...e, checkout: undefined, checkin: undefined }));
    } else if (moment(startOfDate(moment(date, "jYYYY/jMM/jD").toDate())).toISOString() == state?.checkout) {
      setState((e) => ({ ...e, checkout: undefined }));
    } else if (!state?.checkin || moment(date, "jYYYY/jMM/jD").isBefore(moment(state?.checkin))) {
      setState((e) => ({
        ...e,
        checkin: moment(startOfDate(moment(date, "jYYYY/jMM/jD").toDate())).toISOString(),
        checkout: undefined,
      }));
    } else {
      setState((e) => ({
        ...e,
        checkout: moment(startOfDate(moment(date, "jYYYY/jMM/jD").toDate())).toISOString(),
      }));

      if (cb) {
        cb();
      }
    }
  }
};

export default DateStateHelperStringfy;
