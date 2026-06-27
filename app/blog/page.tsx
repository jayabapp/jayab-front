import Breadcrumbs from "@/components/BreadCrumbs";
import serverCall from "@/helpers/serverCall";
import { apiRoutes, baseUrl } from "@/utils/urls";

import { Metadata } from "next";

import BlogsClientPageComponent from "@/components/SinglePageComponents/Blogs/ClientPage";
import MehaHeaderHelper from "@/helpers/MetaHeaderHelper";

export async function generateMetadata(): Promise<Metadata> {
  const { data: blogContent } = await serverCall(baseUrl + apiRoutes.SINGLE_CONTENT_CATEGORY("blog"));

  return MehaHeaderHelper(blogContent);
}

const BlogsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: number; sort?: "mostVisited" | "newest"; q: string; category: string }>;
}) => {
  const searchParamsData = await searchParams;

  const { data: blogs } = await serverCall(
    baseUrl + apiRoutes.CONTENTS + `?key=${"blog"}&per_page=18&page=${searchParamsData?.page || 1}`,
  );
  return (
    <div className="app-container  !overflow-visible">
      <Breadcrumbs />
      <BlogsClientPageComponent />
      {/* <div className="grid grid-cols-3 gap-4">
        <div className=" col-span-3  md:mt-6 md:px-4">
          {!blogs ? (
            <LottieLoading />
          ) : isEmpty(blogs?.data) ? (
            <EmptyList />
          ) : blogs?.data ? (
            <div className="grid mt-6 grid-cols-1 md:grid-cols-3  gap-8">
              {blogs?.data?.map((e: any) => (
                <LatestBlogCard item={e} key={`${e?.id}blog`} />
              ))}
            </div>
          ) : (
            <></>
          )}{" "}
          <Suspense fallback={<div />}>
            <ServerSidePaginate
              q={searchParamsData?.q || ""}
              currentPage={searchParamsData?.page || 1}
              pageSize={18}
              totalCount={blogs?.meta?.total}
              siblingCount={1}
            />
          </Suspense>
        </div>
      </div> */}
    </div>
  );
};

export default BlogsPage;
