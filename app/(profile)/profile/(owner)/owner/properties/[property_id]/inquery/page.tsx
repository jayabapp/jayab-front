"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import { useOwnerProperty } from "@features/owner-property/hooks/useOwnerProperty";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useParams } from "next/navigation";
import { WeekDays } from "@/utils/constantss";
import { ImageDto } from "@/api_services/auth/auth.interface";

import DaysOfTheWeekStatus from "@/components/properties/DaysOfTheWeekStatus";
import MultiLineFormInput from "@/components/shared/Form/MultiLineFormInput";
import ShareImageItems from "@/components/properties/imageComponents/ShareImageItems";
import ProductSkeleton from "@/components/properties/ProductSkeleton";
import ElementToImage from "@/components/ElementToImage";
import _STRINGS from "@/utils/LocalStrings";
import moment from "moment-jalaali";
import Image from "next/image";

moment.loadPersian();
const PropertyInquery = () => {
  const [week, setWeek] = useState<any[]>([]);
  const [desc, setDesc] = useState("");

  const [selectedImage, setSelectedImage] = useState<ImageDto | null>(null);
  const params = useParams();
  const { property_id } = params;
  const { data, isLoading } = useOwnerProperty(`${property_id ?? ""}`);

  useEffect(() => {
    if (!!data && !selectedImage) setSelectedImage(data?.feature_image);
  }, [data]);

  useEffect(() => {
    const dayOfWeek = moment().day();
    const weeks = [];
    for (let index = dayOfWeek; index < dayOfWeek + 7; index++) {
      const item = WeekDays?.find((e) => {
        if (index >= 7) return e?.id == index - 7;
        else return e?.id == index;
      });
      if (index < 7) weeks.push(item);
      else weeks.push(item);
    }
    setWeek(weeks);
  }, []);

  return (
    <div className=" profile-container grid gap-4   md:grid-cols-2  flex-col items-start justify-center !h-auto    ">
      {!!isLoading ? (
        <ProductSkeleton />
      ) : !!data ? (
        <>
          <div className="w-full flex  order-2 md:order-1 flex-col gap-4">
            <ElementToImage className=" p-4 rounded-2xl gap-3 bg-brand-50  w-full flex flex-col ">
              <div className="w-full  aspect-square relative ">
                <Image
                  fill
                  alt={selectedImage?.alt || ""}
                  src={NEW_IMAGE_URL(selectedImage)}
                  sizes="(min-width: 768px) 40vw, 96vw"
                  className=" rounded-2xl  w-full object-cover aspect-square"
                />
              </div>
              <div className="w-full flex flex-col items-center gap-1 justify-center ">
                {" "}
                <div className="text-xs   items-center justify-center text-center  w-full">
                  {moment().format("jDD / jMMMM / jYYYY  ")}
                </div>
                <div className="w-full flex items-start md:items-center justify-between gap-2">
                  {" "}
                  <p className=" font-medium text-lg w-full md:text-2xl ">
                    {data?.title}
                  </p>{" "}
                </div>
              </div>

              <DaysOfTheWeekStatus week={week} data={data?.reserve_days} />
              <div className="w-full flex items-center gap-5">
                <div className=" flex  flex-row  items-center gap-2 justify-start">
                  {" "}
                  <p className="text-xs  shrink-0 ">
                    {_STRINGS.TODAY_STATUS} :
                  </p>
                  <p
                    className={` font-bold ${!!data?.is_today_reserved ? " text-red-500 " : " text-brand-600 "} `}
                  >
                    {!!data?.is_today_reserved
                      ? _STRINGS.OCCUPIED
                      : _STRINGS.EMPTY}{" "}
                  </p>
                </div>
                <div className="flex  items-start gap-1">
                  <img
                    src="/assets/icons/adds/pin_point_location.svg"
                    className="w-5 h-5 aspect-square"
                  />
                  <p className="text-xs leading-[19px]">
                    {data?.city}{" "}
                    <span className=" font-light  text-xs">
                      ({data?.province})
                    </span>
                  </p>
                </div>
              </div>

              {desc ? (
                <div className="w-full flex flex-col  gap-2">
                  <p className=""> {_STRINGS.DESCRIPTION} :</p>
                  <p className=" w-full whitespace-pre-wrap break-words ">
                    {desc}
                  </p>
                </div>
              ) : (
                <></>
              )}
            </ElementToImage>
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
            <div className="w-full flex items-start gap-2">
              <img
                className="w-5 h-5 aspect-square "
                src="/assets/icons/property/alert_icon.svg"
              />
              <p>{_STRINGS.SHARE_PROP_MESSAGE}</p>
            </div>
          </div>{" "}
          <div className=" grid grid-cols-4  w-full order-1 md:order-2 gap-2 border-b pb-4 md:border-0 ">
            <div className="w-full col-span-full mb-2 ">
              {_STRINGS.SELECT_YOUR_IMAGE} :
            </div>
            {data?.images?.map((e) => (
              <ShareImageItems
                image={e}
                cb={() => {
                  setSelectedImage(e);
                }}
                key={`extraImages$${e?.id}`}
                isSelected={selectedImage?.id == e?.id}
              />
            ))}
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default PropertyInquery;
