import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";
import { BrandTitle } from "@elements/BrandTitle";

import type { HeaderBrandProps } from "@/types/components/modules/site-header";

import Link from "next/link";

const HeaderBrand = ({
  asLink,
  isLight,
  alwaysShowTitle,
  markOnly = false,
}: HeaderBrandProps) => {
  const t = useTranslations("common");

  const mark = (
    <div className="flex items-center shrink-0 gap-1 justify-center">
      <BrandTitle
        tone={isLight ? "white" : "blue"}
        className={`h-6 w-auto ${markOnly ? "hidden" : alwaysShowTitle || isLight ? "flex" : "hidden xl:flex"}`}
      />
      <ContentImage
        alt=""
        width={40}
        height={40}
        src="/assets/icons/logo/mark.svg"
        className={`${markOnly ? "size-8" : "size-10"} aspect-square shrink-0`}
      />
    </div>
  );

  if (!asLink) return mark;

  return (
    <Link
      href="/"
      title={t("jayab")}
      className={`flex shrink-0 items-center gap-1.5 ${markOnly ? "size-8" : "h-10"}`}
    >
      {mark}
    </Link>
  );
};

export default HeaderBrand;
