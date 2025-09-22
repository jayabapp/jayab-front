import React, { use, useEffect, useState } from "react";

import { NEW_IMAGE_URL } from "@/utils/urls";
import ProgressBar from "../shared/progressbar";

const UploadedItemShowCase = ({
  containerClass,
  innerClasses,
  item,
  onDelete,
  cb,
  progress,
}: {
  item: any;
  containerClass?: string;
  innerClasses?: { sizeClass?: string; secontParentClass?: string };
  onDelete?: () => void | null;
  cb: () => void | null;
  progress: number;
}) => {
  const [showRealData, setShowRealData] = useState(false);
  return (
    <div className={`flex w-fit relative  ${containerClass} `} style={{ zIndex: "4 !important" }}>
      {/* <div id="myVIdeo"></div> */}
      {(!!progress || progress == 0) && !showRealData ? (
        <div className=" rounded-20 z-1 px-4   absolute left-0 top-0 w-full h-full flex items-center justify-center bg-black/40">
          <ProgressBar
            step={Math.ceil((Number(progress) || 0.2) * 100)}
            divs={Array.from({ length: 101 }, (v, k) => k).map((e, index) => ({
              value: e,
              id: e,
              color: "#f87171",
              width: index,
            }))}
          />
        </div>
      ) : (
        <></>
      )}
      <div
        className={`flex  w-fit  flex-col     items-center justify-start   rounded-20 ${innerClasses?.secontParentClass}`}
        // style={{ overflowX: "scroll" }}
      >
        <div
          className={` ${
            !!innerClasses?.sizeClass ? innerClasses?.sizeClass : "h-24 w-24"
          }  rounded-20  overflow-hidden  flex flex-col items-center relative `}
        >
          <div
            onClick={() => {
              cb();
            }}
            className={`cursor-pointer border   bg-whiteGray-100  dark:bg-zinc-700  rounded-20 aspect-square relative  ${
              !!innerClasses?.sizeClass ? innerClasses?.sizeClass : "h-24 w-24"
            } `}
          >
            {!!item?.data ? (
              <img
                onLoad={() => {
                  setShowRealData(true);
                }}
                alt="img"
                src={NEW_IMAGE_URL(item?.data)}
                className={`object-cover  w-full bg-gradient-to-b rounded-20 aspect-square max-w-max 
                   ${!!innerClasses?.sizeClass ? innerClasses?.sizeClass : "h-24 w-24"}
                  `}
              />
            ) : (
              <></>
            )}
            {!!item?.url ? (
              <img
                alt="img"
                src={item?.url}
                className={`object-cover  ${
                  !!showRealData ? "opacity-0" : "opacity-100"
                } absolute left-0 top-0 right-0 bottom-0 m-auto w-full bg-gradient-to-b rounded-20 aspect-square max-w-max 
                  
                   ${!!innerClasses?.sizeClass ? innerClasses?.sizeClass : "h-24 w-24"}
                  `}
              />
            ) : (
              <></>
            )}
          </div>
          {!!onDelete && !!item?.data ? (
            <div
              className="   bg-transparent cursor-pointer absolute top-2 left-2 shadow-2xl "
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
            >
              <img src="/assets/icons/uploader/faded_x_circle.svg" />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>{" "}
    </div>
  );
};

export default UploadedItemShowCase;
