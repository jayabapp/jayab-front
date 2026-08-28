"use client";

import { colors } from "@/theme/colors";
import _STRINGS from "@/utils/LocalStrings";
import { useMemo } from "react";
import AdvisorCircularProgresCard from "./AdvisorCircularProgressPart/AdvisorCircularProgresCard";
import { AdvisorPageListDto } from "@/api_services/advisor/advisor.interface";
import { NEW_IMAGE_URL } from "@/utils/urls";
import timeLeft from "@/helpers/timeLeft";
import Image from "next/image";

const AdvisorCard = ({
  data,
  callback,
  isSingle,
}: {
  data: AdvisorPageListDto;
  callback?: () => void | null;
  isSingle?: boolean;
}) => {
  const cities = useMemo(
    () => isSingle ? data?.cities ?? [] : (data?.cities ?? []).slice(0, 4),
    [data?.cities, isSingle],
  );

  return (
    <div onClick={callback} className=" rounded-2xl gap-2   shadow-card  p-4  w-full  flex flex-col items-center ">
      <div className="w-full flex items-center gap-2">
        {/* IMAGE PART    */}
        <div className=" flex flex-col gap-2 h-full justify-between w-1/4  lg:w-1/5 2xl:w-1/4">
          <div className="relative w-full  aspect-square ">
            {" "}
            <Image
              src={
                !!data?.user?.profile_image
                  ? NEW_IMAGE_URL(data?.user?.profile_image)
                  : "/assets/icons/shared/image_placeholder.svg"
              }
              alt={data?.user?.profile_image?.alt || data?.user?.full_name || "تصویر مشاور"}
              fill
              sizes="(max-width: 768px) 25vw, 120px"
              className="rounded-full object-cover"
            />
          </div>
          <div className=" shrink-0 text-xs md:text-xs flex items-center justify-center px-1 md:px-2 py-1 rounded-md  bg-brand-600 text-white ">
            {_STRINGS.CODE} {data?.user?.referral_code}
          </div>
        </div>
        <div className=" w-3/4 lg:w-4/5  2xl:w-3/4   flex flex-col gap-2 h-full justify-between shrink-0">
          <p className="  font-medium  text-sm md:text-base">{data?.user?.full_name}</p>
          {/* CIRCULAR PROGRESS PARTS  */}
          <div className="w-full flex md:flex-cow  items-center justify-between gap-2">
            <AdvisorCircularProgresCard
              containerClass=" w-[35%]"
              pStyles={{ pathColor: colors.brand[500], textColor: colors.brand[500], textSize: "2rem" }}
              data={{ value: data?.users_satisfaction || 100 }}
              item={{ linear_title: _STRINGS.USERS_SATISFACTION, linear_title_class: "text-brand-600" }}
            />
            <AdvisorCircularProgresCard
              containerClass=" w-[35%]"
              pStyles={{ pathColor: colors.success[500], textColor: colors.success[500], textSize: "2rem" }}
              data={{ value: data?.owners_satisfaction || 100 }}
              item={{ linear_title: _STRINGS.OWNERS_SATISFACTION, linear_title_class: "text-success-600" }}
            />
          </div>
          <p className=" text-sm ">
            {_STRINGS.XP} : {timeLeft(data?.created_at).replace("پیش", "")}
          </p>
        </div>
      </div>

      <div className={`flex  ${isSingle ? "" : "line-clamp-1"}  text-sm items-start gap-2 w-full`}>
        <p className="shrink-0">{_STRINGS.ACTIVITY_FIELD} :</p>
        <div className={`  flex gap-1 flex-wrap ${isSingle ? "" : "line-clamp-1"}   items-center `}>
          {cities?.map((e, index) => (
            <p key={`${data?.id}${e}${index}`} className="text-xs">
              {`${index != 0 ? "," : ""}${e}`}{" "}
            </p>
          ))}

          {!isSingle && cities?.length < data?.cities?.length ? "..." : ""}
        </div>
      </div>
    </div>
  );
};

export default AdvisorCard;
