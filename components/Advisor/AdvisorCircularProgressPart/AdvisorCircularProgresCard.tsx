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
  item: { linear_title_class?: string; linear_title?: string; title?: string; title_class?: string };
  pStyles?: {
    textColor?: string;
    pathColor?: string;
    textSize?: string;
  };
}) => {
  return (
    <div className="w-full  flex items-center  gap-1 md:gap-2">
      {item?.linear_title ? (
        <p className={`text-xxs shrink-0 md:text-sm  ${item?.linear_title_class} `}>{item?.linear_title} :</p>
      ) : (
        <></>
      )}
      <div className="w-full flex  items-center gap-4 flex-col">
        <CircularProgressbar
          className=" max-w-20 md:p-2 !pr-0"
          value={data?.value}
          text={`${data?.value}`}
          strokeWidth={10}
          styles={!!pStyles ? buildStyles(pStyles) : {}}
        />
        {item?.title ? (
          <p className={` text-xxs shrink-0 md:text-sm w-fit  ${item?.title_class}`}>{item?.title}</p>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default AdvisorCircularProgresCard;
