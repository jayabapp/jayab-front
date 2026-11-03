import { resolveLocale } from "@/i18n/config";
import { ContentImage } from "@elements/Image";
import { useLocale } from "next-intl";

import type { BrandTitleProps } from "@/types/components/elements/brand-title";

const TITLE_SIZE = {
  en: { width: 520, height: 207 },
  fa: { width: 604, height: 236 },
} as const;

const BrandTitle = ({ tone, script: scriptProp, className = "" }: BrandTitleProps) => {
  const localeScript = resolveLocale(useLocale()) === "en" ? "en" : "fa";
  const script = scriptProp ?? localeScript;

  return (
    <ContentImage
      alt=""
      {...TITLE_SIZE[script]}
      src={`/assets/icons/logo/title-${script}-${tone}.svg`}
      className={`${tone === "blue" ? "logo-adapt" : ""} ${className}`}
    />
  );
};

export default BrandTitle;
