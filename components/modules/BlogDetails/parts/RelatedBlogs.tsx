import { getHomeImageUrl } from "@features/home/mappers/home-image.mapper";
import type { RelatedBlogsProps } from "@/types/components/modules/blog";

import moment from "moment-jalaali";
import Image from "next/image";
import Link from "next/link";

const RelatedBlogs = ({ currentId, items }: RelatedBlogsProps) => (
  <div className="flex flex-col gap-4">
    <p>مطالب مشابه</p>
    {items.filter((item) => item?.id !== currentId).map((item) => (
      <Link title={item?.title || ""} key={item?.id} href={`/blog/${encodeURI(item?.slug || "")}`} className="group grid grid-cols-4 items-center justify-start gap-2 rounded-md transition-all hover:bg-brand-600/5">
        <div className="cols-span-1 relative aspect-square w-full overflow-clip rounded-md">
          <Image fill sizes="(min-width: 768px) 7vw, 23vw" className="h-full w-full rounded-md object-cover transition-all group-hover:scale-110" src={getHomeImageUrl(item?.feature_image)} alt={item?.feature_image?.alt || ""} />
        </div>
        <div className="col-span-3 flex h-full flex-col justify-around py-2">
          <p className="line-clamp-2 text-sm font-bold">{item?.title}</p>
          <p className="text-xxs">{moment(item?.created_at).format("jYYYY/jMM/jDD")}</p>
        </div>
      </Link>
    ))}
  </div>
);

export default RelatedBlogs;
