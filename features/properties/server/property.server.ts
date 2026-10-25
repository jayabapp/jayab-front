import { normalizePropertyFilters } from "@features/properties/lib/normalize-property-filters";
import { apiRoutes, baseUrl } from "@/utils/urls";
import { resolveLocale } from "@/i18n/config";
import { propertyKeys } from "@features/properties/api/property.keys";
import { REVALIDATE } from "@/helpers/revalidate";
import { getLocale } from "next-intl/server";
import { cache } from "react";

import type { PropertyFilters } from "@features/properties/lib/normalize-property-filters";
import type { QueryClient } from "@tanstack/react-query";

import serverCall from "@/helpers/serverCall";

const PAGE_SIZE = 30;

export const getServerPropertyPage = cache(async (filters: PropertyFilters) => {
  const locale = resolveLocale(await getLocale());
  return serverCall(
    baseUrl + apiRoutes.GET_PROPERTIES,
    {
      page: 1,
      per_page: PAGE_SIZE,
      ...normalizePropertyFilters(filters),
      locale,
    },
    { revalidate: REVALIDATE.PROPERTY_LIST },
  );
});

export const getServerPropertyDetail = cache(async (slug: string) => {
  const locale = resolveLocale(await getLocale());
  return serverCall(
    baseUrl + apiRoutes.GET_SINGLEPROPERTY_SlUG(slug),
    { locale },
    {
      redirect404: true,
      redirect410: true,
      revalidate: REVALIDATE.PROPERTY_DETAIL,
    },
  );
});

export const seedPropertyList = async (
  queryClient: QueryClient,
  filters: PropertyFilters,
  page: unknown,
) => {
  if (!page) return;
  const locale = resolveLocale(await getLocale());
  queryClient.setQueryData(
    propertyKeys.list(normalizePropertyFilters({ ...filters, locale })),
    {
      pages: [page],
      pageParams: [Number(filters.page) || 1],
    },
  );
};
