"use client";

import { ContentDto } from "@/api_services/home/home.interface";

import DOMPurify from "isomorphic-dompurify";
import { isEmpty } from "lodash";
import moment from "moment-jalaali";
import Image from "next/image";
import { Fragment } from "react";
import { NEW_IMAGE_URL } from "../../utils/urls";
import SingleProductBreadCrumb from "../BreadCrumbs/SingleProductBreadCrumb";
import BlogShare from "./BlogShare";
import SmoothScroll from "./smooth-scroll";

export interface ImageTextDTO {
  data?: ContentDto;
  children?: any;
  timeToRead?: number;
  breadcrumb?: {
    title: string;
    link: string;
  }[];
}

const MainImageTextBlock = ({ data, children, timeToRead, breadcrumb }: ImageTextDTO) => {
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
    <Fragment>
      <SmoothScroll />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={`order-0 w-full  oveflow-clip !rounded-20 h-full !aspect-[3/2]   lg:order-last relative  px-0 `}
        >
          <Image
            fill
            className="w-full !aspect-[3/2] !rounded-20 object-cover "
            src={NEW_IMAGE_URL(item?.image)}
            alt={item?.title}
          />
        </div>
        {!isEmpty(breadcrumb) && !!breadcrumb ? (
          <div className="w-full md:hidden flex">
            <SingleProductBreadCrumb dataArray={breadcrumb} />
          </div>
        ) : (
          <></>
        )}

        <div className="w-full md:!aspect-[3/2] gap-1.5 md:gap-16 flex flex-col">
          <div className="flex flex-col w-full h-fit md:aspect-[2] ">
            <h1> {item?.title}</h1>
            {children}
          </div>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0  md:gap-y-4">
              <div className="flex col-span-1 flex-row items-center gap-1.5">
                <img src="/assets/icons/blogs/calendar.svg" className="w-5 h-5" alt="calendar" />
                <p className="text-sm font-black ">تاریخ انتشار: {moment(data?.created_at)?.format("jYYYY/jMM/jDD")}</p>
              </div>
              {!!data?.fields?.author && (
                <div className="flex col-span-1 flex-row items-center gap-1.5">
                  <img src="/assets/icons/blogs/author.svg" className="w-5 h-5" alt="calendar" />
                  <p className="text-sm font-black ">نویسنده: {data?.fields?.author}</p>
                </div>
              )}
              <div className="flex col-span-1 md:col-start-3 flex-row items-center gap-1.5">
                <img src="/assets/icons/blogs/time.svg" className="w-5 h-5" alt="calendar" />
                <p className="text-sm shrink-0 font-black ">زمان تقریبی مطالعه: {timeToRead} دقیقه</p>
              </div>
              <BlogShare data={data as ContentDto} />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default MainImageTextBlock;
