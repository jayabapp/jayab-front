import { SingleOwnerPropertyDto, SinglePropDto } from "@/api_services/property/property.interface";
import numberWithCommas from "@/helpers/numberWithCommas";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";

const SinglePropertyPricePart = ({ data }: { data: SinglePropDto | SingleOwnerPropertyDto }) => {
  return (
    <div className="flex flex-row   w-fit gap-2 md:gap-2 ">
      {data.today_price?.discount_percentage ? (
        <div className="w-7 gap-0.5 hidden md:flex left-2 flex-col h-5 rounded-md transition-all  px-1 py-[0.2rem]   bg-primary-150 text-white  aspect-square  items-center justify-center">
          <p className="  text-xxs   ">%{data.today_price?.discount_percentage}</p>{" "}
        </div>
      ) : (
        <></>
      )}
      {!!data?.today_price?.discounted_price ? (
        <p className=" text-sm md:text-base  line-through  opacity-50">
          {numberWithCommas(data?.today_price?.price)} <span>{_STRINGS.TOMAN}</span>
        </p>
      ) : (
        <></>
      )}

      <p className="font-bold text-sm md:text-base text-primary-700">
        {numberWithCommas(
          !!data?.today_price?.discounted_price ? data?.today_price?.discounted_price : data?.today_price?.price
        )}{" "}
        <span className="text-xs">{_STRINGS.TOMAN}</span>
      </p>
      {data.today_price?.discount_percentage ? (
        <div className="w-7 gap-0.5 absolute md:hidden left-2 flex-col h-5 rounded-md transition-all  px-1 py-[0.2rem]   bg-primary-900 text-white  aspect-square flex items-center justify-center">
          <p className="  text-xxs   ">%{data.today_price?.discount_percentage}</p>{" "}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SinglePropertyPricePart;
