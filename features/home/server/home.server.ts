import { apiRoutes, baseUrl, baseUrlV } from "@/utils/urls";
import { resolveLocale } from "@/i18n/config";
import { REVALIDATE } from "@/helpers/revalidate";
import { getLocale } from "next-intl/server";
import { cache } from "react";

import serverCall from "@/helpers/serverCall";

import type { LandingsPlacements } from "@/enum/landings.enum";
import type { BannerPosition } from "@/enum/banners.enum";
import type { Locale } from "@/i18n/config";

export const getServerBanners = cache((positions: BannerPosition[]) =>
  serverCall(
    `${baseUrlV("v2")}${apiRoutes.BANNERS}?${positions
      .map((position) => `positions[]=${encodeURIComponent(position)}`)
      .join("&")}`,
    undefined,
    { revalidate: REVALIDATE.BANNERS },
  ),
);

export const getServerLandings = cache(
  (placement: LandingsPlacements, locale: Locale = "fa") =>
    serverCall(
      baseUrl + apiRoutes.USER_LANDING_PAGES,
      { placement, locale },
      {
        revalidate: REVALIDATE.LANDINGS,
      },
    ),
);

export const getServerContentList = cache(
  (
    key: string,
    page: number,
    perPage: number,
    summary = false,
    locale?: Locale,
  ) =>
    serverCall(
      baseUrl + apiRoutes.CONTENTS,
      { key, page, per_page: perPage, summary: summary || undefined, locale },
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

// A landing that does not exist or is switched off must be a real 404, not an empty page.
export const getServerLandingOr404 = cache((slug: string) =>
  serverCall(baseUrl + apiRoutes.SINGLE_USER_LANDING_PAGE(slug), undefined, {
    redirect404: true,
    revalidate: REVALIDATE.LANDINGS,
  }),
);

export const getServerPropertyList = cache(
  async (page: number, perPage: number) => {
    const locale = resolveLocale(await getLocale());
    return serverCall(
      baseUrl + apiRoutes.GET_PROPERTIES,
      { page, per_page: perPage, locale },
      {
        revalidate: REVALIDATE.PROPERTY_LIST,
      },
    );
  },
);

export const getServerPropertyTypes = cache((locale: Locale = "fa") =>
  serverCall(
    `${baseUrl}${apiRoutes.USER_PROP_OPTIONS}?group[]=PROPERTY_TYPE&locale=${locale}`,
    undefined,
    { revalidate: REVALIDATE.PROPERTY_OPTIONS },
  ),
);

export { getCmsContent as getServerCmsContent } from "@/api_services/home/cms-content.server";
