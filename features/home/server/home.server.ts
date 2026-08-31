import { apiRoutes, baseUrl, baseUrlV } from "@/utils/urls";
import { REVALIDATE } from "@/helpers/revalidate";
import { cache } from "react";

import serverCall from "@/helpers/serverCall";

import type { BannerPosition } from "@/enum/banners.enum";
import type { LandingsPlacements } from "@/enum/landings.enum";

export const getServerBanners = cache((positions: BannerPosition[]) =>
  serverCall(
    `${baseUrlV("v2")}${apiRoutes.BANNERS}?${positions
      .map((position) => `positions[]=${encodeURIComponent(position)}`)
      .join("&")}`,
    undefined,
    { revalidate: REVALIDATE.BANNERS },
  ),
);

export const getServerLandings = cache((placement: LandingsPlacements) =>
  serverCall(
    baseUrl + apiRoutes.USER_LANDING_PAGES,
    { placement },
    {
      revalidate: REVALIDATE.LANDINGS,
    },
  ),
);

export const getServerContentList = cache(
  (key: string, page: number, perPage: number) =>
    serverCall(
      baseUrl + apiRoutes.CONTENTS,
      { key, page, per_page: perPage },
      {
        revalidate: key === "blog" ? REVALIDATE.BLOG : REVALIDATE.CMS_PAGE,
      },
    ),
);

export const getServerContentBySlug = cache((slug: string) =>
  serverCall(baseUrl + apiRoutes.SINGLE_CONTENT_WITH_SLUG(slug), undefined, {
    redirect404: true,
    revalidate: REVALIDATE.BLOG,
  }),
);

export const getServerContentCategory = cache((key: string) =>
  serverCall(baseUrl + apiRoutes.SINGLE_CONTENT_CATEGORY(key), undefined, {
    revalidate: REVALIDATE.BLOG,
  }),
);

export const getServerLanding = cache((slug: string) =>
  serverCall(baseUrl + apiRoutes.SINGLE_USER_LANDING_PAGE(slug), undefined, {
    revalidate: REVALIDATE.LANDINGS,
  }),
);

export const getServerPropertyList = cache((page: number, perPage: number) =>
  serverCall(
    baseUrl + apiRoutes.GET_PROPERTIES,
    { page, per_page: perPage },
    {
      revalidate: REVALIDATE.PROPERTY_LIST,
    },
  ),
);

export const getServerPropertyTypes = cache(() =>
  serverCall(
    `${baseUrl}${apiRoutes.USER_PROP_OPTIONS}?group[]=PROPERTY_TYPE`,
    undefined,
    { revalidate: REVALIDATE.PROPERTY_OPTIONS },
  ),
);

export { getCmsContent as getServerCmsContent } from "@/api_services/home/cms-content.server";
