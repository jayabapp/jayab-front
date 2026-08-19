import { cmsContentQueryKey } from "./cms-content";
import { apiRoutes, baseUrl } from "@/utils/urls";
import { ContentByKeyDto } from "./home.interface";
import { QueryClient } from "@tanstack/react-query";
import { REVALIDATE } from "@/helpers/revalidate";
import { cache } from "react";

import serverCall from "@/helpers/serverCall";

export const getCmsContent = cache(
  async (key: string): Promise<ContentByKeyDto | null> => {
    const { data } = await serverCall(
      baseUrl + apiRoutes.CONTENT_BY_KEY(key),
      undefined,
      { revalidate: REVALIDATE.CMS_PAGE },
    );
    return data || null;
  },
);

export const seedCmsContent = async (
  queryClient: QueryClient,
  keys: string[],
) => {
  const entries = await Promise.all(
    keys.map(async (key) => [key, await getCmsContent(key)] as const),
  );

  entries.forEach(([key, content]) => {
    if (content) queryClient.setQueryData(cmsContentQueryKey(key), content);
  });
};
