import type { HeaderBrandProps } from "@/types/components/modules/site-header";
import { ContentImage } from "@elements/Image";

import _STRINGS from "@/utils/LocalStrings";
import Link from "next/link";

const HeaderBrand = ({
  asLink,
  isLight,
  markOnly,
  alwaysShowTitle,
}: HeaderBrandProps) => {
  const mark = (
    <div className="flex items-center shrink-0 gap-1 justify-center">
      {markOnly ? (
        <></>
      ) : (
        <ContentImage
          alt=""
          width={64}
          height={25}
          src="/assets/icons/logo/just_title_logo.svg"
          className={`w-16 h-auto ${alwaysShowTitle ? "flex" : isLight ? "flex grayscale brightness-[500]" : "hidden xl:flex"}`}
        />
      )}
      <ContentImage
        alt=""
        width={40}
        height={40}
        src="/assets/icons/logo/header_mobile_logo.svg"
        className={`aspect-square shrink-0 ${markOnly ? "size-8" : "w-10 h-10"}`}
      />
    </div>
  );

  if (!asLink) return mark;

  return (
    <Link
      href="/"
      title={_STRINGS.JAYAB}
      className={`flex items-center gap-1.5 shrink-0 ${markOnly ? "h-8" : "h-10"}`}
    >
      {mark}
    </Link>
  );
};

export default HeaderBrand;
