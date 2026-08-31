import { getServerContentBySlug } from "@features/home/server/home.server";
import { apiRoutes, baseUrl } from "@/utils/urls";
import { convertHtmlToReact } from "@/helpers/convertHTMLtoReact";
import { ContentFAQSchema } from "@/components/SchemaGenerator/Schemas";
import { ContentQuestions } from "@/components/ContentQuestions";
import { HTMLGenerator } from "@/helpers/html.generator";
import { ContentImage } from "@elements/Image";
import { BlogSchema } from "@/components/SchemaGenerator/Schemas";
import { ContentDto } from "@/api_services/home/home.interface";
import { REVALIDATE } from "@/helpers/revalidate";
import { Metadata } from "next";
import { Suspense } from "react";

import SingleProductBreadCrumb from "@/components/BreadCrumbs/SingleProductBreadCrumb";
import MainImageTextBlock from "@/components/blogs/MainImageTextBlock";
import MehaHeaderHelper from "@/helpers/MetaHeaderHelper";
import RelatedBlogs from "@/components/blogs/RelatedBlogs";
import serverCall from "@/helpers/serverCall";
import Gallery from "@/components/blogs/Gallery";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string; blog_id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { blog_id } = await params;
  const { data: blogData } = await getServerContentBySlug(blog_id);
  return MehaHeaderHelper(blogData);
}
const SingleBlogPage = async ({ params }: Props) => {
  const { blog_id } = await params;
  const { data }: { data: ContentDto } = await getServerContentBySlug(blog_id);

  const { data: rateData }: { data: { rate: number; rate_count: number } } =
    await serverCall(
      baseUrl + apiRoutes.CONTENTS_QUESTIONS_RATE,
      {
        content_id: data?.id,
      },
      { revalidate: REVALIDATE.CONTENT_RATE },
    );
  const { html, headings, timeToRead, wordCount, faqData } = HTMLGenerator(
    data?.html || "",
    {
      hasHeading: true,
      hasCount: true,
    },
  );

  const breadcrumb = [
    { title: "خانه", link: "/" },
    { title: data?.category?.title || "", link: `/blog` },
    { title: data?.title || "", link: `#` },
  ];

  return (
    <div className="app-container relative !pt-24 flex flex-col !gap-6  !overflow-visible">
      <BlogSchema
        data={data}
        rate={rateData?.rate}
        wordCount={wordCount || 0}
        timeToRead={timeToRead || 0}
        rate_count={rateData?.rate_count}
      />
      <ContentFAQSchema faqData={faqData || []} />
      {!data ? null : (
        <div className="w-full md:flex hidden">
          <SingleProductBreadCrumb dataArray={breadcrumb} />
        </div>
      )}
      <Suspense>
        <MainImageTextBlock
          data={data}
          timeToRead={timeToRead}
          breadcrumb={breadcrumb}
        >
          <div className={` w-full scrollbar   overflow-y-scroll   relative`}>
            {headings?.map((i, index) => (
              <div key={`HEADING${index}`} className={`text-xs! my-4  md:my-6`}>
                <Link
                  replace
                  title={"content"}
                  href={`#${i?.id}`}
                  className="flex  group flex-row items-center justify-start gap-2"
                >
                  <ContentImage
                    alt=""
                    width={12}
                    height={12}
                    src="/assets/icons/shared/blue_chevron_left.svg"
                    className=" w-3 h-3  grayscale group-hover:grayscale-0    group-hover:-rotate-90 transition-all "
                  />
                  <div
                    className="text-[16px] !text-right !font-regular hover:!text-brand-600 transition duration-300 hover:font-bold"
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
            contentId={data?.id}
          />
        </div>
        <div className="md:p-4 rounded-10 md:shadow-md md:bg-white sticky h-fit top-28 self-start flex flex-col gap-8">
          <RelatedBlogs id={data?.id as number} />
          <Suspense>
            <Gallery
              images={data?.attachments?.map((i) => i?.attachment) as []}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default SingleBlogPage;
