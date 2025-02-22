import { PropertyListDto } from "@/api_services/property/property.interface";
import numberWithCommas from "@/helpers/numberWithCommas";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";

const AddCardPricePart = ({
  data,
  containerClass,
}: {
  data: { price?: number; discounted_price?: number; discount_percentage?: number };
  containerClass?: string;
}) => {
  return (
    <div className={`${containerClass || " flex flex-col  w-full gap-0 md:gap-0"} `}>
      {!!data?.discounted_price ? (
        <>
          {" "}
          <div className=" relative gap-2 flex items-center">
            <p className="text-xs md:text-xs relative  flex items-center line-through  opacity-65">
              {" "}
              {numberWithCommas(data?.price)} <span className="text-xxs">{_STRINGS.TOMAN}</span>
            </p>
            {data?.discount_percentage ? (
              <div className="w-7 gap-0.5 flex-col h-5 rounded-md transition-all  px-1 py-[0.2rem]   bg-primary-150 text-white  aspect-square flex items-center justify-center">
                <p className="  text-xxs   ">%{data?.discount_percentage}</p>{" "}
              </div>
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <></>
      )}

      <p className="font-bold text-xs">
        {numberWithCommas(!!data?.discounted_price ? data?.discounted_price : data?.price)}{" "}
        <span className="text-xxs">{_STRINGS.TOMAN}</span>
      </p>
    </div>
  );
};

export default AddCardPricePart;
