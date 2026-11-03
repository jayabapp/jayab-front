import { resolveLocale } from "@/i18n/config";
import { ContentImage } from "@elements/Image";
import { useLocale } from "next-intl";

import type { BrandTitleProps } from "@/types/components/elements/brand-title";

const TITLE_SIZE = {
  en: { width: 600, height: 207 },
  fa: { width: 604, height: 236 },
} as const;

const TITLE_ASSETS = {
  "en-blue": "/assets/icons/logo/title-en-blue-97cb18d05ed5.svg",
  "en-white": "/assets/icons/logo/title-en-white-d5709be66d95.svg",
} as const;

const BrandTitle = ({
  tone,
  script: scriptProp,
  className = "",
}: BrandTitleProps) => {
  const localeScript = resolveLocale(useLocale()) === "en" ? "en" : "fa";
  const script = scriptProp ?? localeScript;
  const asset =
    TITLE_ASSETS[`${script}-${tone}` as keyof typeof TITLE_ASSETS] ??
    `/assets/icons/logo/title-${script}-${tone}.svg`;

  return (
    <ContentImage
      alt=""
      {...TITLE_SIZE[script]}
      src={asset}
      className={`${tone === "blue" ? "logo-adapt" : ""} ${className}`}
    />
  );
};

export default BrandTitle;
