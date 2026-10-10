import { useTranslations } from "next-intl";
import { useMemo } from "react";

import type { LocationWords } from "@features/cities/lib/location-label";

export const useLocationWords = (): LocationWords => {
  const t = useTranslations("common");
  return useMemo(
    () => ({
      local: t("local"),
      province: t("province"),
      city: t("city"),
      separator: t("separator"),
    }),
    [t],
  );
};
