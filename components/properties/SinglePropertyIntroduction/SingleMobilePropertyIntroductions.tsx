import _STRINGS from "@/utils/LocalStrings";
import React from "react";
import AddCardPricePart from "../AddCardPricePart";
import SinglePropertyPricePart from "../SinglePropertyPricePart";
import Button from "@/components/shared/Button/Button";
import { SinglePropDto } from "@/api_services/property/property.interface";

const SingleMobilePropertyIntroductions = ({ data }: { data: SinglePropDto }) => {
  return (
    <div className=" md:hidden w-full flex flex-col relative  gap-4">
      <div className="w-full flex items-start md:items-center justify-between gap-2">
        {" "}
        <p className=" font-medium text-lg w-3/5 md:w-full md:text-2xl ">{data?.title}</p>
        <div className="  w-fit   shrink-0   p-1  rounded-full flex items-center gap-2 bg-black/10   bottom-1">
          <img src="/assets/icons/adds/green_circular_tick.svg" />
          <p className="text-sm text-gray-400 ">{_STRINGS.VERIFIED}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-primary-700 rounded-md text-base  px-2 py-1 text-white flex items-center justify-center">
          کد {data.code}
        </div>{" "}
        <div className="flex items-center gap-1">
          <img className="w-5 h-5 aspect-square" src="/assets/icons/adds/filled_heart.svg" />
          <p className="text-base  opacity-60">{data?.favorites_count}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 border-t  py-2 w-full justify-between">
        <p>{_STRINGS.ROOM_COUNTS} :</p>
        <p className="font-bold text-primary-700">
          {data?.total_bedrooms} {_STRINGS.ROOM}
        </p>
      </div>
      <div className="flex items-center gap-4 border-t  py-2 w-full justify-between">
        <p>{_STRINGS.ROOM_SIZE} :</p>
        <p className="font-bold text-primary-700">
          {data?.building_area} {_STRINGS.METER}
        </p>
      </div>
      <div className="flex items-center gap-4 border-t  py-2 w-full justify-between">
        <div className="flex items-center gap-1">
          <img className="/assets/icons/adds/pin_point_location.svg" src="/assets/icons/adds/pin_point_location.svg" />
          <p>{_STRINGS.PROPERTY_LOC} :</p>
        </div>
        <p className="">
          {data?.city} <span className="opacity-75">({data?.province})</span>
        </p>
      </div>
      {/* 
      <div className="flex items-center gap-4 border-t  py-2 w-full justify-between">
        <p>{_STRINGS.TODAY_STATUS} :</p>
        <p className="font-bold text-primary-700">
          {data?.room_count} 
        </p>
      </div> */}
      <div className="flex items-center gap-4 border-t   py-2 w-full justify-between">
        <div className="flex items-center gap-1">
          <p>{_STRINGS.TODAYS_PRICE} </p>
        </div>
        <SinglePropertyPricePart data={data} />
      </div>
      <Button width="w-full" containerClass="w-full" roundedClass="rounded-full" title={_STRINGS.ONLINE_RESERVE} />
    </div>
  );
};

export default SingleMobilePropertyIntroductions;
