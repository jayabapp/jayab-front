import _STRINGS from "@/utils/LocalStrings";
import React from "react";
import AdvisorCircularProgresCard from "./AdvisorCircularProgressPart/AdvisorCircularProgresCard";
import { AdvisorListDto, AdvisorPageListDto } from "@/api_services/advisor/advisor.interface";
import { NEW_IMAGE_URL } from "@/utils/urls";
import timeLeft from "@/helpers/timeLeft";

const AdvisorCard = ({
  data,
  callback,
  isSingle,
}: {
  data: AdvisorPageListDto;
  callback?: () => void | null;
  isSingle?: boolean;
}) => {
  return (
    <div onClick={callback} className=" rounded-2xl gap-2   shadow-card  p-4  w-full  flex flex-col items-center ">
      <div className="w-full flex items-center gap-2">
        {/* IMAGE PART    */}
        <div className=" flex flex-col gap-2 h-full justify-between w-1/4  md:w-1/5 2xl:w-1/4">
          <div className="relative w-full  aspect-square ">
            {" "}
            <img
              src={
                !!data?.user?.profile_image
                  ? NEW_IMAGE_URL(data?.user?.profile_image)
                  : "/assets/icons/shared/image_placeholder.svg"
              }
              alt={data?.user?.profile_image?.alt || ""}
              className="rounded-full aspect-square w-full h-full"
            />
          </div>
          <div className=" shrink-0 text-xs md:text-sm flex items-center justify-center px-1 md:px-2 py-1 rounded-md  bg-primary-700 text-white ">
            {_STRINGS.CODE} {data?.user?.referral_code}
          </div>
        </div>
        <div className=" w-3/4 md:w-4/5  2xl:w-3/4   flex flex-col gap-2 h-full justify-between shrink-0">
          <p className="  font-medium  text-sm md:text-base">{data?.user?.full_name}</p>
          {/* CIRCULAR PROGRESS PARTS  */}
          <div className="w-full flex md:flex-cow  items-center justify-between gap-2">
            <AdvisorCircularProgresCard
              containerClass=" w-[35%]"
              pStyles={{ pathColor: "#3886E5", textColor: "#3886E5", textSize: "2rem" }}
              data={{ value: data?.users_satisfaction || 100 }}
              item={{ linear_title: _STRINGS.USERS_SATISFACTION, linear_title_class: "text-primary-700" }}
            />
            <AdvisorCircularProgresCard
              containerClass=" w-[35%]"
              pStyles={{ pathColor: "#34C759", textColor: "#34C759", textSize: "2rem" }}
              data={{ value: data?.owners_satisfaction || 100 }}
              item={{ linear_title: _STRINGS.OWNERS_SATISFACTION, linear_title_class: "text-primary-600" }}
            />
          </div>
          <p className=" text-sm ">
            {_STRINGS.XP} : {timeLeft(data?.created_at).replace("پیش", "")}
          </p>
        </div>
      </div>

      <div className={`flex  ${isSingle ? "" : "line-clamp-1"}  text-sm items-center gap-2 w-full`}>
        <p className="shrink-0">{_STRINGS.ACTIVITY_FIELD} :</p>
        <div className="flex gap-1  items-center ">
          {data?.cities?.map((e, index) => (
            <p className="text-xs">{`${index != 0 ? "," : ""}${e}`} </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvisorCard;
