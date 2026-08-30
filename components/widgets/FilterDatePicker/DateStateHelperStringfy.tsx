import startOfDate from "@/helpers/StartOfDate";
import moment from "moment-jalaali";
import React from "react";

type DateStateHelperStringfyType = {
  date: string;
  cb?: () => void | null;
  setState: React.Dispatch<any>;
  state?: { checkin?: string | null; checkout?: string | null };
};

const DateStateHelperStringfy = ({
  cb,
  date,
  state,
  setState,
}: DateStateHelperStringfyType) => {
  if (!!date) {
    if (
      moment(
        startOfDate(moment(date, "jYYYY/jMM/jD").toDate()),
      ).toISOString() == state?.checkin
    ) {
      setState((e: Record<string, unknown>) => ({
        ...e,
        checkout: undefined,
        checkin: undefined,
      }));
    } else if (
      moment(
        startOfDate(moment(date, "jYYYY/jMM/jD").toDate()),
      ).toISOString() == state?.checkout
    ) {
      setState((e: Record<string, unknown>) => ({ ...e, checkout: undefined }));
    } else if (
      !state?.checkin ||
      moment(date, "jYYYY/jMM/jD").isBefore(moment(state?.checkin))
    ) {
      setState((e: Record<string, unknown>) => ({
        ...e,
        checkin: moment(
          startOfDate(moment(date, "jYYYY/jMM/jD").toDate()),
        ).toISOString(),
        checkout: undefined,
      }));
    } else {
      setState((e: Record<string, unknown>) => ({
        ...e,
        checkout: moment(
          startOfDate(moment(date, "jYYYY/jMM/jD").toDate()),
        ).toISOString(),
      }));

      if (cb) {
        cb();
      }
    }
  }
};

export default DateStateHelperStringfy;
