import type { BlogDetailsTemplateProps } from "@/types/components/modules/blog";
import { convertHtmlToReact } from "@/helpers/convertHTMLtoReact";
import { ContentQuestions } from "@modules/ContentQuestions";
import { ContentImage } from "@elements/Image";
import { Suspense } from "react";

import SingleProductBreadcrumb from "@elements/Breadcrumbs/SingleProductBreadcrumb.client";
import MainImageTextBlock from "./parts/MainImageTextBlock.client";
import RelatedBlogs from "./parts/RelatedBlogs";
import Gallery from "./parts/Gallery.client";
import Link from "next/link";

const BlogDetails = ({
  breadcrumb,
  data,
  headings,
  html,
  relatedBlogs,
  timeToRead,
}: BlogDetailsTemplateProps) => (
  <div className="app-container relative !pt-24 flex flex-col !gap-6 !overflow-visible">
    <div className="hidden w-full md:flex">
      <SingleProductBreadcrumb dataArray={breadcrumb} />
    </div>
    <Suspense>
      <MainImageTextBlock
        data={data}
        timeToRead={timeToRead}
        breadcrumb={breadcrumb}
      >
        <div className="scrollbar relative w-full overflow-y-scroll">
          {headings.map((heading) => (
            <div key={heading.id} className="my-4 text-xs! md:my-6">
              <Link
                replace
                title="content"
                href={`#${heading.id}`}
                className="group flex flex-row items-center justify-start gap-2"
              >
                <ContentImage
                  alt=""
                  width={12}
                  height={12}
                  src="/assets/icons/shared/blue_chevron_left.svg"
                  className="h-3 w-3 grayscale transition group-hover:-rotate-90 group-hover:grayscale-0"
                />
                <div
                  className="text-right! text-[16px] font-regular! transition duration-300 hover:font-bold hover:text-brand-600!"
                  dangerouslySetInnerHTML={{ __html: heading.innerText }}
                />
              </Link>
            </div>
          ))}
        </div>
      </MainImageTextBlock>
    </Suspense>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="content col-span-1 w-full rounded-10 md:col-span-2 md:bg-white md:p-4 md:shadow-md">
        <div className="content break-words">{convertHtmlToReact(html)}</div>
        <ContentQuestions
          containerClass="!px-0 border-t !rounded-none !mb-0"
          contentId={data?.id}
        />
      </div>
      <div className="sticky top-28 flex h-fit flex-col gap-8 self-start rounded-10 md:bg-white md:p-4 md:shadow-md">
        <RelatedBlogs currentId={data?.id as number} items={relatedBlogs} />
        <Suspense>
          <Gallery
            images={data?.attachments?.map((item) => item?.attachment) || []}
          />
        </Suspense>
      </div>
    </div>
  </div>
);

export default BlogDetails;
