import { normalizePropertyFilters } from "@features/properties/lib/normalize-property-filters";
import { apiRoutes, baseUrl } from "@/utils/urls";
import { propertyKeys } from "@features/properties/api/property.keys";
import { REVALIDATE } from "@/helpers/revalidate";
import { cache } from "react";

import type { PropertyFilters } from "@features/properties/lib/normalize-property-filters";
import type { QueryClient } from "@tanstack/react-query";

import serverCall from "@/helpers/serverCall";

const PAGE_SIZE = 30;

export const getServerPropertyPage = cache((filters: PropertyFilters) =>
  serverCall(
    baseUrl + apiRoutes.GET_PROPERTIES,
    { page: 1, per_page: PAGE_SIZE, ...filters },
    { revalidate: REVALIDATE.PROPERTY_LIST },
  ),
);

export const getServerPropertyDetail = cache((slug: string) =>
  serverCall(baseUrl + apiRoutes.GET_SINGLEPROPERTY_SlUG(slug), null, {
    redirect404: true,
    redirect410: true,
    revalidate: REVALIDATE.PROPERTY_DETAIL,
  }),
);

export const seedPropertyList = (
  queryClient: QueryClient,
  filters: PropertyFilters,
  page: unknown,
) => {
  if (!page) return;
  queryClient.setQueryData(
    propertyKeys.list(normalizePropertyFilters(filters)),
    {
      pages: [page],
      pageParams: [1],
    },
  );
};
