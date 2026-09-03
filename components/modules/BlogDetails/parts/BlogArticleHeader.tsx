import type { BlogArticleHeaderProps } from "@/types/components/modules/blog";
import { getHomeImageUrl } from "@features/home/mappers/home-image.mapper";

import SingleProductBreadcrumb from "@elements/Breadcrumbs/SingleProductBreadcrumb.client";
import SmoothScroll from "./SmoothScroll.client";
import _STRINGS from "@/utils/LocalStrings";
import BlogShare from "./BlogShare.client";
import isEmpty from "lodash/isEmpty";
import moment from "moment-jalaali";
import Image from "next/image";

moment.loadPersian();

// The image is boxed into its own column instead of running the page width.
// CMS uploads are capped at 1024px, so a full-bleed hero displays them at well
// past their real resolution and the grain shows; at ~26rem it stays sharp.
const HERO_IMAGE_SIZES = "(min-width: 768px) 26rem, 92vw";

const MetaItem = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <span className="flex items-center gap-1.5">
    <Image
      alt=""
      width={16}
      height={16}
      src={icon}
      className="h-4 w-4 shrink-0"
    />
    <span className="text-neutral-600">{label}:</span>
    <span className="font-bold">{value}</span>
  </span>
);

// The article header is a Server Component on purpose. It used to be a client
// one, which pulled `isomorphic-dompurify` and `moment-jalaali` into the route's
// browser bundle — DOMPurify only to sanitise a title that is then rendered as a
// plain string, which React already escapes. The two genuinely interactive bits
// (SmoothScroll, BlogShare) stay their own islands.
const BlogArticleHeader = ({
  data,
  timeToRead,
  breadcrumb,
}: BlogArticleHeaderProps) => {
  if (!data) return <></>;

  return (
    <header className="grid w-full grid-cols-1 items-center gap-5 md:grid-cols-[minmax(0,1fr)_26rem] md:gap-8">
      <SmoothScroll />

      {/* The header halves arrive from their own side; --card-index leaves
          them at 0 so they lead, and the body/sidebar below follow. */}
      <div className="enter-from-right flex w-full flex-col gap-3.5">
        {!isEmpty(breadcrumb) && !!breadcrumb ? (
          <div className="flex w-full md:hidden">
            <SingleProductBreadcrumb dataArray={breadcrumb} />
          </div>
        ) : (
          <></>
        )}

        {!!data?.category?.title ? (
          <span className="w-fit rounded-full bg-brand-50 px-3 py-1 text-xxs font-bold text-brand-600">
            {data.category.title}
          </span>
        ) : (
          <></>
        )}

        <h1>{data?.title}</h1>

        {!!data?.small_text ? (
          <p className="line-clamp-3 text-sm leading-7 text-neutral-600 md:text-base md:leading-8">
            {data.small_text}
          </p>
        ) : (
          <></>
        )}

        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-y border-neutral-100 py-3 text-xs md:text-sm">
          {/* The facts wrap among themselves; the share control is a sibling of
              the whole group so it never gets orphaned onto a line of its own. */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <MetaItem
              icon="/assets/icons/blogs/calendar.svg"
              label={_STRINGS.BLOG_PUBLISHED_ON}
              value={moment(data?.created_at).format("jYYYY/jMM/jDD")}
            />
            {!!data?.fields?.author ? (
              <MetaItem
                icon="/assets/icons/blogs/author.svg"
                label={_STRINGS.BLOG_AUTHOR}
                value={data.fields.author}
              />
            ) : (
              <></>
            )}
            <MetaItem
              icon="/assets/icons/blogs/time.svg"
              label={_STRINGS.BLOG_READ_TIME}
              value={`${timeToRead} ${_STRINGS.BLOG_READ_TIME_UNIT}`}
            />
          </div>
          <BlogShare data={data} />
        </div>
      </div>

      {/* `priority`: this is the LCP element on every article page, so it must
          not wait behind the lazy images further down. */}
      <div className="enter-from-left relative aspect-[4/3] w-full overflow-hidden rounded-20">
        <Image
          fill
          priority
          sizes={HERO_IMAGE_SIZES}
          src={getHomeImageUrl(data?.feature_image)}
          alt={data?.feature_image?.alt || data?.title || ""}
          className="object-cover"
        />
      </div>
    </header>
  );
};

export default BlogArticleHeader;
