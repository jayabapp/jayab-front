"use client";

import { PropertyService } from "@/api_services/property/property.service";
import ElementToImage from "@/components/ElementToImage";
import DaysOfTheWeekStatus from "@/components/properties/DaysOfTheWeekStatus";
import ProductImagesContainer from "@/components/properties/imageComponents/PropertiesImagesPart";
import SingleOwnerPropertycallender from "@/components/properties/owner/SingleOwnerPropertycallender";
import SingleOwnerPropertyIntroduction from "@/components/properties/owner/SingleOwnerPropertyIntroduction";
import SingleOwnerPropertyOptons from "@/components/properties/owner/SingleOwnerPropertyOptons.tsx";
import MultiLineFormInput from "@/components/shared/Form/MultiLineFormInput";

import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import _STRINGS from "@/utils/LocalStrings";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const PropertyInquery = () => {
  const [desc, setDesc] = useState("");
  const params = useParams();
  const { property_id } = params;
  const { data, isLoading } = useQuery({
    queryKey: [PropertyService.OWNER_PROPERTIES_CACHEKEY, property_id],
    queryFn: () => {
      if (!!property_id) {
        return PropertyService.GetSingleOwnerProperty({ property_id: `${property_id}` });
      } else return null;
    },
  });
  return (
    <div className=" profile-container  !pb-48 lg:!pb-36  md:px-[30%]  gap-4   flex flex-col items-center justify-center !h-auto    ">
      {!!isLoading ? (
        <LottieLoading />
      ) : !!data ? (
        <>
          {" "}
          <ElementToImage className=" p-4 rounded-2xl gap-3 bg-primary-500  w-full flex flex-col ">
            <div className="w-full  aspect-square relative ">
              <img
                className=" rounded-2xl  w-full object-cover aspect-square"
                src={NEW_IMAGE_URL(data?.feature_image)}
              />
            </div>
            <div className="w-full flex items-start md:items-center justify-between gap-2">
              {" "}
              <p className=" font-medium text-lg w-3/5 md:w-full md:text-2xl ">{data?.title}</p>{" "}
            </div>

            <div className="w-full flex items-center gap-5">
              <div className=" flex  flex-row  items-center gap-2 justify-start">
                {" "}
                <p className="text-xs  shrink-0 ">{_STRINGS.TODAY_STATUS} :</p>
                <p className={` font-bold ${!!data?.is_today_reserved ? " text-red-500 " : " text-primary-700 "} `}>
                  {!!data?.is_today_reserved ? _STRINGS.OCCUPIED : _STRINGS.EMPTY}{" "}
                </p>
              </div>
              <div className="flex  gap-1">
                <img src="/assets/icons/adds/pin_point_location.svg" className="w-5 h-5 aspect-square" />
                <p className="text-xs">
                  {data?.city} <span className=" font-light  text-xs">({data?.province})</span>
                </p>
              </div>
            </div>
            <DaysOfTheWeekStatus data={data?.reserve_days} />

            <MultiLineFormInput
              onChangeText={(e) => {
                setDesc(e);
              }}
              item={{
                containerClass: "w-full",
                inputClass: "w-full",
                title: _STRINGS.DESCRIPTION,
                placeholder: _STRINGS.YOUR_TEXT,
              }}
              value={desc}
            />
          </ElementToImage>
          <div className="w-full flex items-start gap-2">
            <img className="w-5 h-5 aspect-square " src="/assets/icons/property/alert_icon.svg" />
            <p>{_STRINGS.SHARE_PROP_MESSAGE}</p>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default PropertyInquery;
