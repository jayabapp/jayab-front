import { SinglePropDto } from "@/api_services/property/property.interface";
import numberWithCommas from "@/helpers/numberWithCommas";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";

const SinglePropertyPricePart = ({ data }: { data: SinglePropDto }) => {
  return (
    <div className="flex flex-col w-fit gap-0 md:gap-2 ">
      {!!data?.discounted_price ? (
        <p className=" text-sm md:text-base  line-through  opacity-65">
          {numberWithCommas(data?.today_price)} <span>{_STRINGS.TOMAN}</span>
        </p>
      ) : (
        <></>
      )}

      <p className="font-bold text-xl text-primary-700">
        {numberWithCommas(!!data?.discounted_price ? data?.discounted_price : data?.today_price)}{" "}
        <span className="text-xs">{_STRINGS.TOMAN}</span>
      </p>
    </div>
  );
};

export default SinglePropertyPricePart;
