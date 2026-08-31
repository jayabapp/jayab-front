import type { HeaderBrandProps } from "@/types/components/modules/site-header";
import { ContentImage } from "@elements/Image";

import _STRINGS from "@/utils/LocalStrings";
import Link from "next/link";

const HeaderBrand = ({ isLight, asLink }: HeaderBrandProps) => {
  const mark = (
    <div className="flex items-center shrink-0 gap-1 justify-center">
      <ContentImage
        alt=""
        width={64}
        height={25}
        src="/assets/icons/logo/just_title_logo.svg"
        className={`w-16 h-auto ${isLight ? "flex grayscale brightness-[500]" : "hidden xl:flex"}`}
      />
      <ContentImage
        alt=""
        width={40}
        height={40}
        className="w-10 h-10 aspect-square shrink-0"
        src="/assets/icons/logo/header_mobile_logo.svg"
      />
    </div>
  );

  if (!asLink) return mark;

  return (
    <Link
      href="/"
      prefetch={false}
      title={_STRINGS.JAYAB}
      className="flex items-center gap-1.5 shrink-0 h-10"
    >
      {mark}
    </Link>
  );
};

export default HeaderBrand;
