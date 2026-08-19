import { apiRoutes, baseUrl } from "@/utils/urls";
import { REVALIDATE } from "@/helpers/revalidate";
import { Metadata } from "next";

import BlogsClientPageComponent from "@/components/SinglePageComponents/Blogs/ClientPage";
import MehaHeaderHelper from "@/helpers/MetaHeaderHelper";
import Breadcrumbs from "@/components/BreadCrumbs";
import serverCall from "@/helpers/serverCall";

export async function generateMetadata(): Promise<Metadata> {
  const { data: blogContent } = await serverCall(
    baseUrl + apiRoutes.SINGLE_CONTENT_CATEGORY("blog"),
    undefined,
    {
      revalidate: REVALIDATE.BLOG,
    },
  );
  return MehaHeaderHelper(blogContent);
}

const BlogsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page: number;
    sort?: "mostVisited" | "newest";
    q: string;
    category: string;
  }>;
}) => {
  const searchParamsData = await searchParams;

  const { data: blogs } = await serverCall(
    baseUrl +
      apiRoutes.CONTENTS +
      `?key=${"blog"}&per_page=18&page=${searchParamsData?.page || 1}`,
    undefined,
    { revalidate: REVALIDATE.BLOG },
  );
  return (
    <div className="app-container  !overflow-visible">
      <Breadcrumbs />
      <BlogsClientPageComponent />
    </div>
  );
};

export default BlogsPage;
