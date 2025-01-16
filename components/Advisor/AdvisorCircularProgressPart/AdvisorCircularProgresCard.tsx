import ProgressBar from "@/components/shared/progressbar";
import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const AdvisorCircularProgresCard = ({
  data,
  item,
  pStyles,
}: {
  data: { value: number };
  item: { linear_title_class?: string; linear_title?: string };
  pStyles?: {
    textColor?: string;
    pathColor?: string;
    textSize?: string;
  };
}) => {
  return (
    <div className="w-full  flex items-center  gap-2">
      {item?.linear_title ? (
        <p className={`text-xxs shrink-0 md:text-sm text-primary-700 ${item?.linear_title_class} `}>
          {item?.linear_title} :
        </p>
      ) : (
        <></>
      )}
      <CircularProgressbar
        className=" md:p-2 !pr-0"
        value={data?.value}
        text={`${data?.value}`}
        strokeWidth={10}
        styles={!!pStyles ? buildStyles(pStyles) : {}}
      />
    </div>
  );
};

export default AdvisorCircularProgresCard;
