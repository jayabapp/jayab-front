import { BLOG_IMAGE_QUALITY } from "@features/blog/constants/image";
import { getHomeImageUrl } from "@features/home/mappers/home-image.mapper";
import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";

import type { RelatedBlogsProps } from "@/types/components/modules/blog";

import isEmpty from "lodash/isEmpty";
import moment from "moment-jalaali";
import Link from "next/link";

moment.loadPersian();

const RelatedBlogs = ({ currentId, items }: RelatedBlogsProps) => {
  const t = useTranslations("content");

  const related = items?.filter((item) => item?.id !== currentId) ?? [];

  if (isEmpty(related)) return <></>;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-bold">{t("blogRelated")}</p>

      {related.map((item) => (
        <Link
          key={item?.id}
          title={item?.title || ""}
          href={`/blog/${encodeURI(item?.slug || "")}`}
          className="group flex items-center gap-3 rounded-10 p-1 transition-colors hover:bg-selected"
        >
          <div className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-10">
            <ContentImage
              fill
              sizes="64px"
              quality={BLOG_IMAGE_QUALITY}
              alt={item?.feature_image?.alt || ""}
              src={getHomeImageUrl(item?.feature_image)}
              className="object-cover transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <p className="line-clamp-2 text-xs font-bold leading-5 transition-colors group-hover:text-link">
              {item?.title}
            </p>
            <p className="text-2xs text-ink-muted">
              {moment(item?.created_at).format("jYYYY/jMM/jDD")}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RelatedBlogs;
