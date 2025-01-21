"use client";

import DOMPurify from "isomorphic-dompurify";
import React from "react";
import { imageUrl, IMAGE_URL, NEW_IMAGE_URL } from "../../utils/urls";
import { Divider } from "../shared/Divider";
import _STRINGS from "@/utils/LocalStrings";
import moment from "moment-jalaali";
import { ImageDto } from "@/api_services/auth/auth.interface";

export interface ImageTextDTO {
  data?: {
    feature_image: ImageDto;
    title?: string;
    full_text: string;
    small_text?: string;
    created_at?: string | number;
  };
  children?: any;
}

const MainImageTextBlock = ({ data, children }: ImageTextDTO) => {
  let item;

  if (data)
    item = {
      title: DOMPurify.sanitize(data.title || data.small_text || ""),
      body: DOMPurify.sanitize(data.small_text || data.full_text),
      image: data.feature_image,
      // items: data.items || [],
    };

  if (!item) return <></>;
  return (
    <div className="w-full  flex  flex-col  md:flex-row  gap-4  relative ">
      <div className={` ${"order-0 w-full md:w-3/5 lg:order-last"} px-0 md:px-4`}>
        <img
          // src={IMAGE_URL(item?.image)}
          src={NEW_IMAGE_URL(item?.image)}
          className="w-full   md:aspect-[1.5/1] lg:w-full h-auto mx-auto object-cover rounded-lg img-dark"
          alt={item.title}
        />
      </div>
      <div className="w-full  rounded-md  pt-4 pb-6   md:w-[60%]   flex rtl flex-col justify-between px-4">
        <div className="flex flex-col gap-2 text-xl">
          <p> {moment(data?.created_at).format("jYYYY/jMM/jDD")}</p>
          <h1 className="text-3xl  leading-8 mb-3"> {item?.title}</h1>
          {/* <Divider moreClass="w-20 border-primary-700 dark:border-primary-700 mt-2 mb-5 h-1 bg-primary-700 rounded-full" /> */}
          {/* <div className=" z-2 flex gap-2  justify-center md:justify-start items-center">
            <p className="  text-2xl md:text-4xl font-bold text-white">{title}</p>
          </div> */}
          <div
            className=" rounded-md p-4 !text-justify border  !text-base  !leading-4 md:!leading-6 opacity-80"
            dangerouslySetInnerHTML={{ __html: item.body || _STRINGS.LOREM }}
          />
          <div>
            {/* {item.items?.map((e) => (
              <div key={e.id} className={`flex justify-start ${"items-center"} mt-4`}>
                {e.image_location ? (
                  <img src={imageUrl + e.image_location} className="w-auto h-auto" alt="" />
                ) : (
                  <div className="w-2 h-10 rounded-full bg-primary-700 mt-1.5" />
                )}
                <span className={  "font-bold mr-4"}>{e.description}</span>
              </div>
            ))} */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainImageTextBlock;
