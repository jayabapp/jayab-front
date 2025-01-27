import { PropertyListDto } from "@/api_services/property/property.interface";
import numberWithCommas from "@/helpers/numberWithCommas";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";

const AddCardPricePart = ({
  data,
  containerClass,
}: {
  data: { price?: number; discounted_price?: number };
  containerClass?: string;
}) => {
  return (
    <div className={`${containerClass || " flex flex-col  w-full gap-0 md:gap-2"} `}>
      {!!data?.discounted_price ? (
        <p className=" text-sm md:texxt-base  line-through  opacity-65">
          {numberWithCommas(data?.price)} <span>{_STRINGS.TOMAN}</span>
        </p>
      ) : (
        <></>
      )}

      <p className="font-bold text-base">
        {numberWithCommas(!!data?.discounted_price ? data?.discounted_price : data?.price)}{" "}
        <span className="text-sm">{_STRINGS.TOMAN}</span>
      </p>
    </div>
  );
};

export default AddCardPricePart;
