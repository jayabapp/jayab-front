import numberWithCommas from "@/helpers/numberWithCommas";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";

const DayPricePart = ({ data }: { data: { price?: number; discounted_price?: number } }) => {
  return (
    <div className="flex  flex-col relative w-full items-center justify-center gap-0 md:gap-2 ">
      {!!data?.discounted_price ? (
        <p className=" text-xxs md:text-sm line-through  absolute -top-2  opacity-60">
          {numberWithCommas((data?.price || 1) / 1000)}
        </p>
      ) : (
        <></>
      )}

      <p className=" text-xs md:text-sm opacity-80 ">
        {numberWithCommas(!!data?.discounted_price ? data?.discounted_price / 1000 : (data?.price || 1) / 1000)}{" "}
      </p>
    </div>
  );
};

export default DayPricePart;
