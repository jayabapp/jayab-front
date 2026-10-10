import { useTranslations } from "next-intl";

import type { FooterQuickSearchProps } from "@/types/components/modules/site-footer";

import Link from "next/link";

const FooterQuickSearch = ({ links }: FooterQuickSearchProps) => {
  const t = useTranslations("footer");

  return (
    <div className="pb-6 px-0 md:px-[10%] gap-4 md:gap-4 w-full flex flex-col">
      <p className="text-base md:text-lg font-bold px-4 md:px-0">
        {t("quickSearch")}
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
              className="bg-surface border shadow-sm min-w-[140px] shrink-0 shadow-black/10 border-line-strong relative rounded-20 h-6 md:h-8 flex items-center justify-start ps-4 font-medium text-xs text-start"
            >
              {link?.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FooterQuickSearch;
