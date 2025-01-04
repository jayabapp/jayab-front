import numberWithCommas from "@/helpers/numberWithCommas";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";

const AddCardPricePart = ({ data, containerClass }: { data: any; containerClass?: string }) => {
  return (
    <div className={`${containerClass || " flex flex-col md:flex-row w-full gap-0 md:gap-2"} `}>
      {!!data?.discounted_price ? (
        <p className=" text-xs md:texxt-sm  line-through  opacity-65">
          {numberWithCommas(data?.price)} <span>{_STRINGS.TOMAN}</span>
        </p>
      ) : (
        <></>
      )}

      <p className="font-bold text-sm">
        {numberWithCommas(!!data?.discounted_price ? data?.discounted_price : data?.price)}{" "}
        <span className="text-xxs">{_STRINGS.TOMAN}</span>
      </p>
    </div>
  );
};

export default AddCardPricePart;
