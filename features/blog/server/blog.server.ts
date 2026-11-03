import { apiRoutes, baseUrl } from "@/utils/urls";
import { HTMLGenerator } from "@/helpers/html.generator";
import { REVALIDATE } from "@/helpers/revalidate";

import type { ContentDto } from "@/api_services/home/home.interface";

import serverCall from "@/helpers/serverCall";
import { cache } from "react";
import { unstable_cache } from "next/cache";

const RELATED_BLOGS_URL = `${baseUrl}${apiRoutes.CONTENTS}?key=blog&page=1&per_page=4&summary=true`;

export const getServerRelatedBlogs = cache(async () => {
  const response = (await serverCall(RELATED_BLOGS_URL, undefined, {
    revalidate: REVALIDATE.BLOG,
  })) as { data?: { data?: ContentDto[] } };

  return response?.data?.data ?? [];
});

export const getCachedBlogHtml = (
  slug: string,
  updatedAt: string,
  sourceHtml: string,
) =>
  unstable_cache(
    async () =>
      HTMLGenerator(sourceHtml, {
        hasHeading: true,
        hasCount: true,
      }),
    ["blog-html-generator-v1", slug, updatedAt],
    { revalidate: REVALIDATE.BLOG },
  )();
