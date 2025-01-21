import { RelatedLandings } from "@/api_services/property/property.interface";
import Link from "next/link";
import React from "react";

const ContentRelatedTags = ({ data }: { data: RelatedLandings[] }) => {
  return (
    <div className=" w-full flex flex-col gap-2">
      <div className=" flex flex-wrap gap-2 w-full">
        {data?.map((e) => (
          <Link
            key={`${e?.title}relatedContent`}
            prefetch={false}
            href={e?.url}
            className="w-fit border-primary-250 py-1.5 px-2.5 border-2 rounded-full flex items-center gap-2  "
          >
            <p className="text-primary-250 ">{e?.title}</p>
            <div className="w-4 h-4 aspect-square flex items-center justify-center">
              <img src="/assets/icons/shared/upper_left_arrow.svg" className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ContentRelatedTags;
