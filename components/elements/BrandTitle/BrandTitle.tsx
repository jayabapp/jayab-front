import { resolveLocale } from "@/i18n/config";
import { ContentImage } from "@elements/Image";
import { useLocale } from "next-intl";

import type { BrandTitleProps } from "@/types/components/elements/brand-title";

const TITLE_SIZE = {
  en: { width: 782, height: 218 },
  fa: { width: 624, height: 244 },
} as const;

const BrandTitle = ({ tone, className = "" }: BrandTitleProps) => {
  const script = resolveLocale(useLocale()) === "en" ? "en" : "fa";

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
