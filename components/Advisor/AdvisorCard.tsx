import _STRINGS from "@/utils/LocalStrings";
import React from "react";
import AdvisorCircularProgresCard from "./AdvisorCircularProgressPart/AdvisorCircularProgresCard";

const AdvisorCard = ({
  data,
  callback,
}: {
  data: {
    id: number;
    name: string;
    avatar: string;
    code: string;
    locations: string[];
    owners_satisfaction: number;
    users_satisfaction: number;
  };
  callback?: () => void | null;
}) => {
  return (
    <div onClick={callback} className=" rounded-2xl gap-2   shadow-card  p-4  w-full  flex items-center ">
      {/* IMAGE PART    */}
      <div className=" flex flex-col gap-2 h-full justify-between  w-1/5">
        <div className="relative w-full  aspect-square ">
          {" "}
          <img src={data?.avatar} className="rounded-full aspect-square w-full h-full" />
        </div>
        <div className=" text-sm md:text-base flex items-center justify-center px-2 py-1 rounded-md  bg-primary-700 text-white ">
          {_STRINGS.CODE} {data?.code}
        </div>
      </div>
      <div className=" w-4/5  flex flex-col gap-2 h-full justify-between">
        <p className="  font-medium  text-sm md:text-base">{data?.name}</p>
        {/* CIRCULAR PROGRESS PARTS  */}
        <div className="w-full flex md:flex-cow  items-center justify-between gap-2">
          <AdvisorCircularProgresCard
            pStyles={{ pathColor: "#3886E5", textColor: "#3886E5", textSize: "1.2rem" }}
            data={{ value: data?.users_satisfaction }}
            item={{ linear_title: _STRINGS.USERS_SATISFACTION, linear_title_class: "text-primary-700" }}
          />
          <AdvisorCircularProgresCard
            pStyles={{ pathColor: "#34C759", textColor: "#34C759", textSize: "1.2rem" }}
            data={{ value: data?.owners_satisfaction }}
            item={{ linear_title: _STRINGS.OWNERS_SATISFACTION, linear_title_class: "text-primary-600" }}
          />
        </div>
        <div className="flex text-xs md:text-sm items-center gap-2">
          <p>{_STRINGS.ACTIVITY_FIELD} :</p>
          <p>{data?.locations}</p>
        </div>
      </div>
    </div>
  );
};

export default AdvisorCard;
