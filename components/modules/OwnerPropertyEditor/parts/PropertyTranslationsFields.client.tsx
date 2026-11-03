"use client";

import { useTranslations } from "next-intl";
import { useId } from "react";

import type { PropertyTranslations } from "@/types/features/owner-property";

const PropertyTranslationsFields = ({
  value,
}: {
  value: PropertyTranslations;
}) => {
  const t = useTranslations("owner");
  const id = useId();

  return (
    <fieldset className="col-span-full space-y-4 rounded-xl border p-4">
      <legend className="px-2 font-medium">
        {t("propertyTranslationsTitle")} ({t("optional")})
      </legend>
      <p className="text-sm text-ink-muted">{t("propertyTranslationsHint")}</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {(["ar", "en"] as const).map((locale) => (
          <div key={locale} className="space-y-3">
            <div className="flex flex-col gap-2">
              <label htmlFor={`${id}-${locale}-title`}>
                {t(`${locale}PropertyTitle`)}
              </label>
              <input
                id={`${id}-${locale}-title`}
                lang={locale}
                dir={locale === "ar" ? "rtl" : "ltr"}
                value={value[locale]?.title ?? ""}
                maxLength={200}
                disabled
                className="w-full rounded-10 border bg-surface px-3 py-2 text-ink disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor={`${id}-${locale}-address`}>
                {t(`${locale}PropertyAddress`)}
              </label>
              <textarea
                rows={3}
                lang={locale}
                maxLength={1000}
                id={`${id}-${locale}-address`}
                value={value[locale]?.address ?? ""}
                dir={locale === "ar" ? "rtl" : "ltr"}
                disabled
                className="w-full rounded-10 border bg-surface px-3 py-2 text-ink disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default PropertyTranslationsFields;
