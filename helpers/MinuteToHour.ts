import React from "react";
import _STRINGS from "../../../utils/LocalStrings";

const MinuteToHour = (mins: number | undefined) => {
  if (!!mins) {
    if (mins < 60) {
      return `${mins} ${_STRINGS.MINUTES}`;
    } else {
      const hours = Math.floor(mins / 60);
      const remainingMins = (mins / 60 - hours) * 60;
      if (!!remainingMins) {
        return `   ${hours}   ${_STRINGS.HOURS}   و  ${Math.round(remainingMins)}   ${_STRINGS.MINUTES} `;
      } else {
        return `    ${hours}   ${_STRINGS.HOURS} `;
      }
    }
  } else {
    return "Invalid Data";
  }
};

export default MinuteToHour;
