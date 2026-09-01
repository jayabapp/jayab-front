import { BlogSchema, ContentFAQSchema } from "@features/seo/components/Schemas";
import { getServerContentBySlug } from "@features/home/server/home.server";
import { apiRoutes, baseUrl } from "@/utils/urls";
import { HTMLGenerator } from "@/helpers/html.generator";
import { REVALIDATE } from "@/helpers/revalidate";

import type { BlogDetailsRouteProps } from "@/types/app/routes";
import type { ContentDto } from "@/api_services/home/home.interface";
import type { Metadata } from "next";

import BlogDetailsTemplate from "@templates/BlogDetails";
import MehaHeaderHelper from "@/helpers/MetaHeaderHelper";
import BlogDetails from "@modules/BlogDetails";
import serverCall from "@/helpers/serverCall";

export const generateMetadata = async ({
  params,
}: BlogDetailsRouteProps): Promise<Metadata> => {
  const { blog_id } = await params;
  const { data } = await getServerContentBySlug(blog_id);
  return MehaHeaderHelper(data);
};

const BlogDetailsPage = async ({ params }: BlogDetailsRouteProps) => {
  const { blog_id } = await params;
  const { data }: { data: ContentDto } = await getServerContentBySlug(blog_id);
  const { data: relatedData }: { data: { data: ContentDto[] } } =
    await serverCall(
      baseUrl + apiRoutes.CONTENTS + "?key=blog&page=1&per_page=4",
      undefined,
      { revalidate: REVALIDATE.BLOG },
    );
  const { data: rateData }: { data: { rate: number; rate_count: number } } =
    await serverCall(
      baseUrl + apiRoutes.CONTENTS_QUESTIONS_RATE,
      { content_id: data?.id },
      { revalidate: REVALIDATE.CONTENT_RATE },
    );
  const { html, headings, timeToRead, wordCount, faqData } = HTMLGenerator(
    data?.html || "",
    { hasHeading: true, hasCount: true },
  );
  const breadcrumb = [
    { title: "خانه", link: "/" },
    { title: data?.category?.title || "", link: "/blog" },
    { title: data?.title || "", link: "#" },
  ];
  const schema = (
    <>
      <BlogSchema
        data={data}
        rate={rateData?.rate}
        wordCount={wordCount || 0}
        timeToRead={timeToRead || 0}
        rate_count={rateData?.rate_count}
      />
      <ContentFAQSchema faqData={faqData || []} />
    </>
  );
  return (
    <BlogDetailsTemplate schema={schema}>
      <BlogDetails
        data={data}
        html={html}
        breadcrumb={breadcrumb}
        headings={headings || []}
        timeToRead={timeToRead || 0}
        relatedBlogs={relatedData?.data || []}
      />
    </BlogDetailsTemplate>
  );
};

export default BlogDetailsPage;
