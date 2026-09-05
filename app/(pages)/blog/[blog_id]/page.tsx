import { BlogSchema, ContentFAQSchema } from "@features/seo/components/Schemas";
import { getServerContentBySlug } from "@features/home/server/home.server";
import { getCachedBlogHtml } from "@features/blog/server/blog.server";

import type { BlogDetailsRouteProps } from "@/types/app/routes";
import type { Metadata } from "next";

import BlogDetailsTemplate from "@templates/BlogDetails";
import MehaHeaderHelper from "@/helpers/MetaHeaderHelper";
import BlogDetails from "@modules/BlogDetails";

export const generateMetadata = async ({
  params,
}: BlogDetailsRouteProps): Promise<Metadata> => {
  const { blog_id } = await params;
  const { data } = await getServerContentBySlug(blog_id);
  return MehaHeaderHelper(data);
};

const BlogDetailsPage = async ({ params }: BlogDetailsRouteProps) => {
  const { blog_id } = await params;

  const { data } = await getServerContentBySlug(blog_id);

  const { html, headings, timeToRead, wordCount, faqData } = await getCachedBlogHtml(
    blog_id,
    String(data?.updated_at ?? ""),
    data?.html || "",
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
      />
    </BlogDetailsTemplate>
  );
};

export default BlogDetailsPage;
