import { getHomeImageUrl } from "@features/home/mappers/home-image.mapper";
import type { BlogCardProps } from "@/types/components/modules/blog";
import type { CSSProperties } from "react";

import BlogCardLink from "./BlogCardLink.client";
import _STRINGS from "@/utils/LocalStrings";
import Editable from "@elements/Editable";
import moment from "moment-jalaali";
import Image from "next/image";

moment.loadPersian();

// One column on a phone, three from md — mirrors the grid the list renders into.
const BLOG_IMAGE_SIZES = "(min-width: 1536px) 26vw, (min-width: 768px) 30vw, 92vw";

const BlogCard = ({ item, index }: BlogCardProps) => {
  const href = `/blog/${item?.slug}`;

  return (
    <Editable
      contentId={item?.id}
      containerClass="h-full"
      style={{ "--card-index": index ?? 0 } as CSSProperties}
      className="lift-card stagger-rise flex h-full flex-col overflow-hidden rounded-20 border border-white bg-white"
    >
      {/* One link for the whole card. The old markup wrapped the image, the text
          and a "مشاهده" button in three separate anchors to the same href, which
          costs three tab stops and three identical links per card. */}
      <BlogCardLink
        href={href}
        title={item?.title}
        className="flex h-full flex-col !outline-none"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            fill
            sizes={BLOG_IMAGE_SIZES}
            className="lift-card-media object-cover"
            alt={item?.feature_image?.alt || item?.title}
            src={getHomeImageUrl(item?.feature_image, "medium")}
          />
          <div className="lift-card-scrim pointer-events-none absolute inset-0" />

          {!!item?.category?.title ? (
            <span className="absolute right-2 top-2 rounded-full bg-white/85 px-2 py-1 text-[0.625rem] font-bold text-brand-600 shadow-sm backdrop-blur-[6px]">
              {item.category.title}
            </span>
          ) : (
            <></>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-3 md:p-4">
          <p className="line-clamp-2 text-sm font-bold leading-6 md:text-base">
            {item?.title}
          </p>
          <p className="line-clamp-2 whitespace-pre-wrap text-xs leading-6 text-neutral-600 md:text-sm">
            {item?.small_text || item?.full_text || ""}
          </p>

          <div className="mt-auto flex items-center justify-between gap-2 border-t border-neutral-100 pt-2.5 text-xxs text-neutral-600">
            <div className="flex items-center gap-2">
              <span>{moment(item?.created_at).format("jYYYY/jMM/jDD")}</span>
              {!!item?.view_count ? (
                <span className="border-r border-neutral-300 pr-2">
                  {item.view_count} {_STRINGS.VIEW_COUNT_SUFFIX}
                </span>
              ) : (
                <></>
              )}
            </div>

            <span className="flex items-center gap-1 font-bold text-brand-600">
              {_STRINGS.READ_ARTICLE}
              <svg
                fill="none"
                aria-hidden="true"
                viewBox="0 0 8 12"
                className="lift-card-arrow h-2.5 w-2"
              >
                <path
                  d="M6.5 1 1.5 6l5 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </BlogCardLink>
    </Editable>
  );
};

export default BlogCard;
