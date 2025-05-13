import React, { useState } from "react";
import FullscreenImage from "./FullScreenImage";
import { ImageDto } from "@/api_services/auth/auth.interface";
import { NEW_IMAGE_URL } from "@/utils/urls";

const UploadedItemShowCase = ({
  containerClass,
  innerClasses,
  item,
  onDelete,
  cb,
}: {
  item: ImageDto;
  containerClass?: string;
  innerClasses?: { sizeClass?: string; secontParentClass?: string };
  onDelete?: () => void | null;
  cb: () => void | null;
}) => {
  return (
    <div className={`flex w-fit  ${containerClass} `} style={{ zIndex: "4 !important" }}>
      {/* <div id="myVIdeo"></div> */}
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
            <img
              alt="img"
              src={NEW_IMAGE_URL(item)}
              className={`object-cover  w-full bg-gradient-to-b rounded-20 aspect-square max-w-max 
                  
                   ${!!innerClasses?.sizeClass ? innerClasses?.sizeClass : "h-24 w-24"}
                  `}
            />
          </div>
          {!!onDelete ? (
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
