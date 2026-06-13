import { ContentDto } from "@/api_services/home/home.interface";
import Gallery from "@/components/blogs/Gallery";
import MainImageTextBlock from "@/components/blogs/MainImageTextBlock";
import RelatedBlogs from "@/components/blogs/RelatedBlogs";
import SingleProductBreadCrumb from "@/components/BreadCrumbs/SingleProductBreadCrumb";
import { ContentQuestions } from "@/components/ContentQuestions";
import { HTMLGenerator } from "@/helpers/html.generator";
import serverCall from "@/helpers/serverCall";
import { apiRoutes, baseUrl } from "@/utils/urls";
import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";

import { BlogSchema, ContentFAQSchema } from "@/components/SchemaGenerator/Schemas";
import { convertHtmlToReact } from "@/helpers/convertHTMLtoReact";
import MehaHeaderHelper from "@/helpers/MetaHeaderHelper";
import { Suspense } from "react";
type Props = {
  params: Promise<{ id: string; blog_id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { blog_id } = await params;

  const { data: blogData } = await serverCall(baseUrl + apiRoutes.SINGLE_CONTENT_WITH_SLUG(blog_id));

  return MehaHeaderHelper(blogData);
}
const SingleBlogPage = async ({ params }: Props) => {
  const { blog_id } = await params;
  const { data }: { data: ContentDto } = await serverCall(
    baseUrl + apiRoutes.SINGLE_CONTENT_WITH_SLUG(blog_id),
    undefined,
    { redirect404: true },
  );

  const { html, headings, timeToRead, wordCount, faqData } = HTMLGenerator(data?.html || "", {
    hasHeading: true,
    hasCount: true,
  });

  const breadcrumb = [
    { title: "خانه", link: "/" },
    { title: data?.category?.title || "", link: `/blog` },
    { title: data?.title || "", link: `#` },
  ];
  return (
    <div className="app-container relative !pt-24 flex flex-col !gap-6  !overflow-visible">
      <BlogSchema data={data} timeToRead={timeToRead || 0} wordCount={wordCount || 0} />
      <ContentFAQSchema faqData={faqData || []} />
      {!data ? null : (
        <div className="w-full md:flex hidden">
          <SingleProductBreadCrumb dataArray={breadcrumb} />
        </div>
      )}
      <Suspense>
        <MainImageTextBlock breadcrumb={breadcrumb} data={data} timeToRead={timeToRead}>
          <div className={` w-full scrollbar   overflow-y-scroll   relative`}>
            {headings?.map((i, index) => (
              <div key={`HEADING${index}`} className={`text-xs! my-4  md:my-6`}>
                <Link
                  title={"content"}
                  href={`#${i?.id}`}
                  replace
                  className="flex  group flex-row items-center justify-start gap-2"
                >
                  <img
                    src="/assets/icons/shared/blue_chevron_left.svg"
                    className=" w-3 h-3  grayscale group-hover:grayscale-0    group-hover:-rotate-90 transition-all "
                  />
                  <div
                    className="text-[16px] !text-right !font-regular hover:!text-primary-700 transition duration-300 hover:font-bold"
                    dangerouslySetInnerHTML={{ __html: i?.innerText }}
                  />
                </Link>
              </div>
            ))}
          </div>
        </MainImageTextBlock>
      </Suspense>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-10 content w-full md:shadow-md md:bg-white md:p-4 col-span-1 md:col-span-2">
          <div className="break-words content">{convertHtmlToReact(html)} </div>
          <ContentQuestions
            containerClass="!px-0 border-t !rounded-none !mb-0"
            title="نظر خود را در مورد این مطلب بنویسید:"
            // showRate={false}
            contentId={data?.id}
          />
        </div>
        <div className="md:p-4 rounded-10 md:shadow-md md:bg-white sticky h-fit top-28 self-start flex flex-col gap-8">
          <RelatedBlogs id={data?.id as number} />
          <Suspense>
            <Gallery images={data?.attachments?.map((i) => i?.attachment) as []} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default SingleBlogPage;
