import { ContentDto } from "@/api_services/home/home.interface";
import serverCall from "@/helpers/serverCall";
import { apiRoutes, baseUrl, IMAGE_URL, NEW_IMAGE_URL } from "@/utils/urls";
import moment from "moment-jalaali";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

const RelatedBlogs: FC<{ id: number }> = async ({ id }) => {
  const { data: blogs }: { data: { data: ContentDto[] } } = await serverCall(
    baseUrl + apiRoutes.CONTENTS + `?key=blog&page=1&per_page=4`
  );
  return (
    <div className="flex flex-col gap-4">
      <p>مطالب مشابه</p>

      {blogs?.data
        ?.filter((e) => e?.id !== id)
        ?.map((i) => (
          <Link
            key={`/blog/${encodeURI(i?.slug || "")}`}
            href={`/blog/${encodeURI(i?.slug || "")}`}
            className="grid group grid-cols-4 hover:bg-primary-700/5 transition-all rounded-md items-center justify-start gap-2"
          >
            <div className="cols-span-1 relative w-full aspect-square rounded-md overflow-clip">
              <Image
                fill
                className="w-full h-full group-hover:scale-110 transition-all object-cover rounded-md"
                src={NEW_IMAGE_URL(i?.feature_image)}
                alt={i?.title}
              />
            </div>
            <div className="flex flex-col  col-span-3 h-full">
              <p className="text-xs  text-right font-light mb-1">{moment(i?.created_at)?.format("jYYYY/jMM/jDD")}</p>
              <p className="font-bold group-hover:text-primary-700 transition-all text-right line-clamp-1">
                {i?.title}
              </p>
              <p className="font-regular  text-sm  text-right line-clamp-2">{i?.small_text}</p>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default RelatedBlogs;
