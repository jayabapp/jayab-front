import { BLOG_IMAGE_QUALITY } from "@features/blog/constants/image";
import { getHomeImageUrl } from "@features/home/mappers/home-image.mapper";
import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";

import type { BlogCardProps } from "@/types/components/modules/blog";
import type { CSSProperties } from "react";

import BlogCardLink from "./BlogCardLink.client";
import Editable from "@elements/Editable";
import moment from "moment-jalaali";

moment.loadPersian();

const BLOG_IMAGE_SIZES =
  "(min-width: 1536px) 26vw, (min-width: 768px) 30vw, 92vw";

const BlogCard = ({ item, index }: BlogCardProps) => {
  const t = useTranslations("content");

  const href = `/blog/${item?.slug}`;

  return (
    <Editable
      contentId={item?.id}
      containerClass="h-full"
      style={{ "--card-index": index ?? 0 } as CSSProperties}
      className="lift-card stagger-rise flex h-full flex-col overflow-hidden rounded-20 border border-white bg-surface"
    >
      <BlogCardLink
        href={href}
        title={item?.title}
        className="flex h-full flex-col !outline-none"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <ContentImage
            fill
            sizes={BLOG_IMAGE_SIZES}
            quality={BLOG_IMAGE_QUALITY}
            className="lift-card-media object-cover"
            src={getHomeImageUrl(item?.feature_image)}
            alt={item?.feature_image?.alt || item?.title}
          />
          <div className="lift-card-scrim pointer-events-none absolute inset-0" />

          {!!item?.category?.title ? (
            <span className="absolute start-2 top-2 rounded-full bg-surface/85 px-2 py-1 text-[0.625rem] font-bold text-link shadow-sm backdrop-blur-[6px]">
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
          <p className="line-clamp-2 whitespace-pre-wrap text-xs leading-6 text-ink-muted md:text-sm">
            {item?.small_text || item?.full_text || ""}
          </p>

          <div className="mt-auto flex items-center justify-between gap-2 border-t border-surface-muted pt-2.5 text-2xs text-ink-muted">
            <div className="flex items-center gap-2">
              <span>{moment(item?.created_at).format("jYYYY/jMM/jDD")}</span>
              {!!item?.view_count ? (
                <span className="border-s border-line-strong ps-2">
                  {t("views", { count: Number(item.view_count) })}
                </span>
              ) : (
                <></>
              )}
            </div>

            <span className="flex items-center gap-1 font-bold text-link">
              {t("readArticle")}
              <svg
                fill="none"
                aria-hidden="true"
                viewBox="0 0 8 12"
                className="lift-card-arrow h-2.5 w-2"
              >
                <path
                  strokeWidth="1.6"
                  d="M6.5 1 1.5 6l5 5"
                  stroke="currentColor"
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
