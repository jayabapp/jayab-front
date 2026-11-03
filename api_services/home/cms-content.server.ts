import { apiRoutes, baseUrl } from "@/utils/urls";
import { ContentByKeyDto } from "./home.interface";
import { REVALIDATE } from "@/helpers/revalidate";
import { cache } from "react";
import type { Locale } from "@/i18n/config";

import serverCall from "@/helpers/serverCall";

export const getCmsContent = cache(
  async (key: string, locale?: Locale): Promise<ContentByKeyDto | null> => {
    const { data } = await serverCall(
      baseUrl + apiRoutes.CONTENT_BY_KEY(key),
      locale ? { locale } : undefined,
      { revalidate: REVALIDATE.CMS_PAGE },
    );
    return data || null;
  },
);
