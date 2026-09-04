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

const RELATED_BLOGS_URL = `${baseUrl}${apiRoutes.CONTENTS}?key=blog&page=1&per_page=4&summary=true`;

export const generateMetadata = async ({
  params,
}: BlogDetailsRouteProps): Promise<Metadata> => {
  const { blog_id } = await params;
  const { data } = await getServerContentBySlug(blog_id);
  return MehaHeaderHelper(data);
};

const BlogDetailsPage = async ({ params }: BlogDetailsRouteProps) => {
  const { blog_id } = await params;

  const [{ data }, { data: relatedData }] = (await Promise.all([
    getServerContentBySlug(blog_id),
    serverCall(RELATED_BLOGS_URL, undefined, { revalidate: REVALIDATE.BLOG }),
  ])) as [{ data: ContentDto }, { data: { data: ContentDto[] } }];

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
        wordCount={wordCount || 0}
        timeToRead={timeToRead || 0}
      />
      <ContentFAQSchema
        faqData={faqData || []}
        url={`${process.env.NEXT_PUBLIC_WEB_SITE}/blog/${data?.slug || blog_id}`}
      />
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
