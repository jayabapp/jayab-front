"use client";

import type { LegacyBlogImageTextProps } from "@/types/components/modules/blog";
import { getHomeImageUrl } from "@features/home/mappers/home-image.mapper";
import { ContentImage } from "@/components/elements/Image";

import DOMPurify from "isomorphic-dompurify";
import _STRINGS from "@/utils/LocalStrings";
import moment from "moment-jalaali";

const MainImageTextBlock = ({ data, children }: LegacyBlogImageTextProps) => {
  let item;

  if (data)
    item = {
      title: DOMPurify.sanitize(data.title || data.small_text || ""),
      body: DOMPurify.sanitize(data.small_text || data.full_text),
      image: data.feature_image,
    };

  if (!item) return <></>;
  return (
    <div className="w-full  flex  flex-col  md:flex-row  gap-4  relative ">
      <div
        className={` ${"order-0 w-full md:w-3/5 lg:order-last"} px-0 md:px-4`}
      >
        <ContentImage
          width={1024}
          height={683}
          alt={item.title}
          src={getHomeImageUrl(item?.image)}
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="w-full   md:aspect-[1.5/1] lg:w-full h-auto mx-auto object-cover rounded-20 img-dark"
        />
      </div>
      <div className="w-full  rounded-md  pt-4 pb-6   md:w-[60%]   flex rtl flex-col justify-between px-4">
        <div className="flex flex-col gap-2 text-xl">
          <p className="text-brand-600 text-xl font-light ">
            {" "}
            {moment(data?.created_at).format("jYYYY/jMM/jDD")}
          </p>
          <h1 className="text-3xl  text-brand-600 font-bold leading-8 mb-3">
            {" "}
            {item?.title}
          </h1>
          <div
            className=" rounded-2xl py-2 px-0 md:p-4 content !text-justify md:border  !text-base  !leading-6 md:!leading-6 opacity-80"
            dangerouslySetInnerHTML={{ __html: item.body || _STRINGS.LOREM }}
          />
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default MainImageTextBlock;
