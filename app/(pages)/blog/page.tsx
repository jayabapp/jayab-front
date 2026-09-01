import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getServerContentCategory } from "@features/home/server/home.server";
import { getServerContentList } from "@features/home/server/home.server";
import { blogListOptions } from "@features/home/api/home.options";
import { Metadata } from "next";

import MehaHeaderHelper from "@/helpers/MetaHeaderHelper";
import getQueryClient from "@lib/query/query-client";
import BlogListTemplate from "@templates/BlogList";

export async function generateMetadata(): Promise<Metadata> {
  const { data: blogContent } = await getServerContentCategory("blog");
  return MehaHeaderHelper(blogContent);
}

const BlogsPage = async () => {
  const { data: blogs } = await getServerContentList("blog", 1, 18);
  const queryClient = getQueryClient();
  queryClient.setQueryData(blogListOptions(18).queryKey, {
    pages: [blogs],
    pageParams: [1],
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogListTemplate />
    </HydrationBoundary>
  );
};

export default BlogsPage;
