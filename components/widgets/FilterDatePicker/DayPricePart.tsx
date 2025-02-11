import numberWithCommas from "@/helpers/numberWithCommas";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";

const DayPricePart = ({ data }: { data: { price?: number; discounted_price?: number } }) => {
  return (
    <div className="flex pb-2 flex-col relative w-full items-center justify-center gap-0 md:gap-2 ">
      {!!data?.discounted_price ? (
        <p className=" text-[0.565rem] md:text-xs line-through  absolute -top-3  opacity-60">
          {numberWithCommas(data?.price)}
        </p>
      ) : (
        <></>
      )}

      <p className=" text-[0.565rem] md:text-xs opacity-80 ">
        {numberWithCommas(!!data?.discounted_price ? data?.discounted_price : data?.price)}{" "}
      </p>
    </div>
  );
};

export default DayPricePart;
