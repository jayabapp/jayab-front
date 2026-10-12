import type { PropertyTranslations } from "@/api_services/property/property.interface";

export const preparePropertyTranslations = (
  value: PropertyTranslations,
): PropertyTranslations =>
  Object.fromEntries(
    (["ar", "en"] as const).flatMap((locale) => {
      const title = value[locale]?.title?.trim();
      const address = value[locale]?.address?.trim();
      return title || address
        ? [
            [
              locale,
              { ...(title ? { title } : {}), ...(address ? { address } : {}) },
            ],
          ]
        : [];
    }),
  );
