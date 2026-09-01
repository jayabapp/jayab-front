import { getHomeImageUrl } from "@features/home/mappers/home-image.mapper";
import type { ArticleProps } from "@/types/components/modules/blog";

import ShareLink from "@elements/Share/BrowserShare.client";
import moment from "moment-jalaali";
import Image from "next/image";

const Article = ({ data, item }: ArticleProps) => {
  return (
    <div className="w-full flex  flex-col md:flex-row  items-start gap-6">
      <div className=" items-center w-full md:w-1/3 justify-center flex flex-wrap">
        {data?.feature_image ? (
          <div
            className={`  rounded-[1.25rem]     aspect-square relative ${item?.customeImageClass || "w-full"}`}
          >
            <Image
              fill
              alt={data?.feature_image?.alt || ""}
              sizes="(min-width: 768px) 30vw, 92vw"
              src={getHomeImageUrl(data?.feature_image)}
              className={`aspect-square    rounded-[1.25rem] !object-contain ${item?.customeImageClass} !w-full`}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="w-full md:w-2/3 h-full justify-between flex flex-col">
        <div className="flex mb-4 items-center justify-between w-full">
          <p className="font-bold">{data?.title}</p>
          <div className=" transition-all flex items-center gap-4">
            <div className="text-sm flex items-center gap-2">
              <p className="text-sm font-medium">
                {moment(data?.created_at).format("jYYYY/jMM/jDD")}
              </p>
            </div>
            <ShareLink />
          </div>
        </div>
        <div
          className="!text-justify content "
          dangerouslySetInnerHTML={{
            __html: data?.small_text,
          }}
        />
      </div>
    </div>
  );
};

export default Article;
