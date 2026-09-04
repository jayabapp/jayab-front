import type { BlogDetailsTemplateProps } from "@/types/components/modules/blog";
import { BLOG_IMAGE_QUALITY } from "@features/blog/constants/image";
import { convertHtmlToReact } from "@/helpers/convertHTMLtoReact";
import { ContentQuestions } from "@modules/ContentQuestions";
import type { CSSProperties } from "react";
import { Suspense } from "react";

import SingleProductBreadcrumb from "@elements/Breadcrumbs/SingleProductBreadcrumb.client";
import BlogTableOfContents from "./parts/BlogTableOfContents";
import BlogArticleHeader from "./parts/BlogArticleHeader";
import RelatedBlogs from "./parts/RelatedBlogs";
import Gallery from "./parts/Gallery.client";

const PANEL_CLASS = "surface-panel p-4 md:p-6";

const BlogDetails = ({
  html,
  data,
  headings,
  breadcrumb,
  timeToRead,
  relatedBlogs,
}: BlogDetailsTemplateProps) => (
  <div className="app-container relative !pt-24 flex flex-col !gap-6 !overflow-visible">
    <div className="hidden w-full md:flex">
      <SingleProductBreadcrumb dataArray={breadcrumb} />
    </div>

    <BlogArticleHeader
      data={data}
      breadcrumb={breadcrumb}
      timeToRead={timeToRead}
    />

    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <article
        style={{ "--card-index": 1 } as CSSProperties}
        className={`enter-from-right col-span-1 w-full md:col-span-2 ${PANEL_CLASS}`}
      >
        <div className="content mx-auto max-w-[68ch] break-words leading-8">
          {convertHtmlToReact(html, BLOG_IMAGE_QUALITY)}
        </div>
        <ContentQuestions
          contentId={data?.id}
          containerClass="!px-0 border-t !rounded-none !mb-0 mt-6"
        />
      </article>

      <aside
        style={{ "--card-index": 2 } as CSSProperties}
        className="enter-from-left flex h-fit flex-col gap-6 self-start md:sticky md:top-28"
      >
        <div className={PANEL_CLASS}>
          <BlogTableOfContents headings={headings} />
        </div>

        <div className={`flex flex-col gap-8 ${PANEL_CLASS}`}>
          <RelatedBlogs currentId={data?.id as number} items={relatedBlogs} />
          <Suspense>
            <Gallery
              images={data?.attachments?.map((item) => item?.attachment) || []}
            />
          </Suspense>
        </div>
      </aside>
    </div>
  </div>
);

export default BlogDetails;
