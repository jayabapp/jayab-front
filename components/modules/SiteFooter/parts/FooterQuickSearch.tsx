import type { FooterQuickSearchProps } from "@/types/components/modules/site-footer";

import _STRINGS from "@/utils/LocalStrings";
import Link from "next/link";

const FooterQuickSearch = ({ links }: FooterQuickSearchProps) => (
  <div className="pb-6 px-0 md:px-[10%] gap-4 md:gap-4 w-full flex flex-col">
    <p className="text-base md:text-lg font-bold px-4 md:px-0">
      {_STRINGS.FAST_SEARCH}
    </p>

    <div className="overflow-x-scroll w-full">
      <div className="w-full px-4 pb-2 md:px-0 min-w-[180dvw] md:min-w-full flex-row grid grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-1.5 md:gap-2.5">
        {links?.map((link) => (
          <Link
            id={link?.title}
            key={link?.title}
            prefetch={false}
            title={link?.title}
            href={link?.link || ""}
            className="bg-white border shadow-sm min-w-[140px] shrink-0 shadow-black/10 border-neutral-300 relative rounded-20 h-6 md:h-8 flex items-center justify-start pr-4 font-medium text-xs text-start"
          >
            {link?.title}
          </Link>
        ))}
      </div>
    </div>
  </div>
);

export default FooterQuickSearch;
