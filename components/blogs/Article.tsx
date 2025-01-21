import { ContentDto } from "@/api_services/home/home.interface";
import { NEW_IMAGE_URL } from "@/utils/urls";
import moment from "moment-jalaali";
import Image from "next/image";
import React from "react";
import { isMobile } from "react-device-detect";
import ShareLink from "../shared/shareComponent/BrowserShare";

const Article = ({ data, item }: { data: ContentDto; item?: { customeImageClass?: string } }) => {
  return (
    <div className="w-full flex  flex-col md:flex-row  items-start gap-6">
      <div className=" items-center w-full md:w-1/3 justify-center flex flex-wrap">
        {data?.feature_image ? (
          <div className={`  rounded-[1.25rem]     aspect-square relative ${item?.customeImageClass || "w-full"}`}>
            <Image
              src={NEW_IMAGE_URL(data?.feature_image)}
              fill
              className={`aspect-square    rounded-[1.25rem] !object-contain ${item?.customeImageClass} !w-full`}
              alt={data?.feature_image?.alt || ""}
            />
          </div>
        ) : (
          <></>
        )}
      </div>{" "}
      <div className="w-full md:w-2/3 h-full justify-between flex flex-col">
        {/* title */}
        <div className="flex mb-4 items-center justify-between w-full">
          {" "}
          <p className="font-bold">{data?.title}</p>
          <div className=" transition-all flex items-center gap-4">
            <div className="text-sm flex items-center gap-2">
              {/* <p className="text-sm font-medium">{data?.view_count}</p> <EyeIcon className="w-6 h-6 aspect-square" /> */}
            </div>{" "}
            <div className="text-sm flex items-center gap-2">
              <p className="text-sm font-medium">{moment(data?.created_at).format("  jYYYY/jMM/jDD")}</p>{" "}
              {/* <CalendarIcon className="w-6 h-6 aspect-square" /> */}
            </div>
            {/* {isMobile ? <ShareButton /> : */}
            <ShareLink />
            {/* } */}
          </div>
        </div>
        {/* description */}
        <div
          className="!text-justify"
          dangerouslySetInnerHTML={{
            __html: data?.small_text,
          }}
        />{" "}
      </div>
    </div>
  );
};

export default Article;
