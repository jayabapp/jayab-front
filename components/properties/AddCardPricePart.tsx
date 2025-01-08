import { PropertyListDto } from "@/api_services/property/property.interface";
import numberWithCommas from "@/helpers/numberWithCommas";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";

const AddCardPricePart = ({ data, containerClass }: { data: PropertyListDto; containerClass?: string }) => {
  return (
    <div className={`${containerClass || " flex flex-col  w-full gap-0 md:gap-2"} `}>
      {!!data?.today_price?.discounted_price ? (
        <p className=" text-xs md:texxt-sm  line-through  opacity-65">
          {numberWithCommas(data?.today_price?.price)} <span>{_STRINGS.TOMAN}</span>
        </p>
      ) : (
        <></>
      )}

      <p className="font-bold text-sm">
        {numberWithCommas(
          !!data?.today_price?.discounted_price ? data?.today_price?.discounted_price : data?.today_price?.price
        )}{" "}
        <span className="text-xxs">{_STRINGS.TOMAN}</span>
      </p>
    </div>
  );
};

export default AddCardPricePart;
