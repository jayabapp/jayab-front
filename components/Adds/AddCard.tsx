import { fakeVilla } from "@/utils/faker";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";
import AddCardPricePart from "./AddCardPricePart";
import Link from "next/link";

const AddCard = () => {
  const data = fakeVilla;
  return (
    <div className="w-full shadow-card  rounded-2xl   grid grid-cols-5 p-3 gap-0 md:gap-2  ">
      {/* INFO */}
      <Link
        href={`/properties/${data?.id}`}
        className="col-span-3  order-1 md:order-2 md:col-span-5 flex flex-col gap-1"
      >
        {/* TITLE */}
        <div className="flex items-center gap-2">
          <img src="/assets/icons/adds/verified_badge.svg" className="w-[1.125rem] h-[1.125rem]" />
          <p className="text-sm font-medium">{data.title}</p>
        </div>

        {/* CODE  - LIKES */}
        <div className="flex items-center gap-4">
          <div className="bg-primary-700 rounded-md text-xs  px-2 py-1 text-white flex items-center justify-center">
            کد {data.code}
          </div>{" "}
          <div className="flex items-center gap-1">
            <img className="w-4 h-4 aspect-square" src="/assets/icons/adds/filled_heart.svg" />
            <p className="text-xxs  opacity-60">{data?.likes}</p>
          </div>
        </div>
        {/* PRICING */}

        <div className="w-full flex  flex-row md:flex-col items-start gap-2 justify-start">
          {" "}
          <p className="text-xs ">{_STRINGS.TODAYS_PRICE}</p>
          <AddCardPricePart data={data} />
        </div>
        {/* DESCRIPTION */}
        <div className="w-full">
          <p className="text-xs">{data?.description}</p>
        </div>
        {/* LOCATION */}

        <div className="flex w-full gap-1">
          <img src="/assets/icons/adds/pin_point_location.svg" className="w-5 h-5 aspect-square" />
          <p className="text-xs">{data?.location_title}</p>
        </div>
      </Link>{" "}
      {/* IMAGE PART */}
      <Link href={`/properties/${data?.id}`} className="col-span-2 md:col-span-5  order-2 md:order-1 ">
        <div className=" aspect-square relative">
          <img src={data?.feature_image} className=" rounded-10  aspect-square" />
          {data?.discount_percantage ? (
            <div className="w-7 gap-0.5 flex-col h-5 rounded-md transition-all  px-1 py-[0.2rem]   bg-primary-100 text-white absolute z-2 right-2 top-2 aspect-square flex items-center justify-center">
              {/* <img className="w-4 h-4" src="/assets/icons/products/discount_tag.svg" /> */}
              <p className="  text-sm   ">%{data.discount_percantage}</p>{" "}
            </div>
          ) : (
            <></>
          )}

          {data?.images_count ? (
            <div className="w-9 gap-0.5  h-5 rounded-md transition-all  py-[0.2rem]   bg-black/50 text-white absolute z-2 left-2 flex-row top-2 aspect-square flex items-center justify-center">
              <p className="  text-sm   ">{data.images_count}</p>{" "}
              <img className="w-3 h-3" src="/assets/icons/adds/simple_camera.svg" />
            </div>
          ) : (
            <></>
          )}
          {data?.isValid ? (
            <div className=" left-0 right-0 w-fit   absolute   p-1  rounded-full flex items-center gap-2 bg-black/60  mx-auto bottom-1">
              <img src="/assets/icons/adds/green_circular_tick.svg" />
              <p className="text-sm text-white">{_STRINGS.VERIFIED}</p>
            </div>
          ) : (
            <></>
          )}
        </div>
      </Link>
    </div>
  );
};

export default AddCard;
