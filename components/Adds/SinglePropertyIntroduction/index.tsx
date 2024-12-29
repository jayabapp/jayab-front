import _STRINGS from "@/utils/LocalStrings";
import React from "react";
import AddCardPricePart from "../AddCardPricePart";
import SinglePropertyPricePart from "../SinglePropertyPricePart";
import Button from "@/components/shared/Button/Button";

const SinglePropertyIntroduction = ({ data }: { data: any }) => {
  return (
    <div className=" w-full flex flex-col relative  gap-4">
      <div className="w-full flex items-center justify-between gap-2">
        {" "}
        <p className=" font-medium text-2xl ">{data?.title}</p>
        <div className="  w-fit      p-1  rounded-full flex items-center gap-2 bg-black/10   bottom-1">
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
          <p className="text-base  opacity-60">{data?.likes}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 border-t  py-2 w-full justify-between">
        <p>{_STRINGS.ROOM_COUNTS} :</p>
        <p className="font-bold text-primary-700">
          {data?.room_count} {_STRINGS.ROOM}
        </p>
      </div>
      <div className="flex items-center gap-4 border-t  py-2 w-full justify-between">
        <p>{_STRINGS.ROOM_SIZE} :</p>
        <p className="font-bold text-primary-700">
          {data?.room_count} {_STRINGS.METER}
        </p>
      </div>
      <div className="flex items-center gap-4 border-t  py-2 w-full justify-between">
        <div className="flex items-center gap-1">
          <img className="/assets/icons/adds/pin_point_location.svg" src="/assets/icons/adds/pin_point_location.svg" />
          <p>{_STRINGS.PROPERTY_LOC} :</p>
        </div>
        <p className="">{data?.location_title}</p>
      </div>
      <div className="flex items-center gap-4 border-t  py-2 w-full justify-between">
        <div className="flex items-center gap-1">
          <img className="/assets/icons/adds/pin_point_location.svg" src="/assets/icons/adds/pin_point_location.svg" />
          <p>{_STRINGS.PROPERTY_LOC} :</p>
        </div>
        <p className="">{data?.location_title}</p>
      </div>
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

export default SinglePropertyIntroduction;
