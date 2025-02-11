"use client";
import moment from "moment-jalaali";

moment.loadPersian({ dialect: "persian-modern" });

const timeLeft = (incomingDate: string | number | Date, moreDetails = true) => {
  var b = moment();
  var a = moment(incomingDate);

  const data = moment.duration(a.diff(b, "minutes"), "minutes").humanize(moreDetails);
  return data;
};

export default timeLeft;
